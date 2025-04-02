import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare, Save, ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose-custom dark:prose-invert story-content min-h-[300px] focus:outline-none',
      },
    },
  });

  // Check if user is authenticated and fetch post data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchPost() {
      if (!id) return;
      
      try {
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (postError) throw postError;
        
        // Check if user is the author
        if (post.author_id !== user?.id) {
          setError("You don't have permission to edit this post");
          return;
        }

        setTitle(post.title);
        editor?.commands.setContent(post.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, user, navigate, editor]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editor || !user || !id) return;

    try {
      setSaving(true);
      setError('');

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title,
          content: editor.getHTML(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('author_id', user.id);

      if (updateError) throw updateError;
      
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
        <Link
          to={`/post/${id}`}
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to post
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary-900 dark:text-white">Edit Story</h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">Make changes to your story</p>
        </div>
        <Link to={`/post/${id}`} className="btn-secondary">
          <ArrowLeft size={18} className="mr-2" />
          Cancel
        </Link>
      </div>
      
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Story Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full text-lg"
              placeholder="Enter an engaging title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Content
            </label>
            <div className="border rounded-lg overflow-hidden border-secondary-200 dark:border-secondary-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
              <div className="bg-secondary-50 dark:bg-secondary-800/60 border-b border-secondary-200 dark:border-secondary-700 px-4 py-2 flex items-center gap-2">
                <PenSquare size={18} className="text-secondary-500 dark:text-secondary-400" />
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">Editor</span>
              </div>
              <div className="p-4 bg-white dark:bg-secondary-800 min-h-[300px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || !title.trim() || !editor?.getText().trim()}
              className="btn-primary"
            >
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <Link
              to={`/post/${id}`}
              className="btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}