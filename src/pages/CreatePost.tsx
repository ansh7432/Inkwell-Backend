import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  async function ensureUserProfile() {
    if (!user) return null;
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .eq('id', user.id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 is "not found" - other errors should be thrown
      throw profileError;
    }
    
    if (profile) return profile;
    
    // Create a profile if it doesn't exist
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          username: user.email?.split('@')[0] || 'user',
        }
      ])
      .select()
      .single();
      
    if (createError) throw createError;
    return newProfile;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editor || !user) return;

    try {
      setLoading(true);
      setError('');

      // Ensure user has a profile
      const profile = await ensureUserProfile();
      if (!profile) throw new Error('Could not create or find user profile');

      // Create the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content: editor.getHTML(),
            author_id: profile.id,
            published: true,
          }
        ])
        .select()
        .single();

      if (postError) throw postError;
      if (post) {
        navigate(`/post/${post.id}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="prose max-w-none">
            <EditorContent editor={editor} className="min-h-[300px] border rounded-md p-4" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !title.trim() || !editor?.getText().trim()}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}