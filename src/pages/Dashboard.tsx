import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Edit, Trash2, AlertCircle, BookOpen, MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  post: {
    title: string;
  };
}

interface Profile {
  username: string;
  email: string;
  avatar_url: string | null;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'stories' | 'comments'>('stories');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchUserData() {
      if (!user) return;
      
      setLoading(true);
      setError('');

      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id, title, content, created_at')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setMyPosts(postsData || []);

        // Fetch user's comments with post info
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id, 
            content, 
            created_at,
            post_id,
            post:posts(title)
          `)
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        const formattedComments = commentsData?.map(comment => ({
          ...comment,
          post: {
            title: comment.post[0]?.title || ''
          }
        })) || [];
        setMyComments(formattedComments);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, navigate]);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Remove the deleted post from the state
      setMyPosts(myPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete the story. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* User Profile Header */}
      <div className="card p-8 mb-8 slide-up">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-3xl font-bold">
            {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              {profile?.username || 'User'}
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">{profile?.email || ''}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-primary-600 dark:text-primary-400" size={18} />
                <span className="font-medium">{myPosts.length} Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="text-primary-600 dark:text-primary-400" size={18} />
                <span className="font-medium">{myComments.length} Comments</span>
              </div>
            </div>
          </div>
          
          <Link to="/create" className="btn-primary text-sm">
            <Edit size={16} className="mr-2" />
            Write Story
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 slide-up">
          <div className="flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-secondary-200 dark:border-secondary-700 mb-6 slide-up">
        <button
          className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'stories'
              ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('stories')}
        >
          My Stories
        </button>
        <button
          className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'comments'
              ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('comments')}
        >
          My Comments
        </button>
      </div>

      {/* Tab content */}
      <div className="slide-up stagger-1">
        {activeTab === 'stories' && (
          <>
            {myPosts.length === 0 ? (
              <div className="text-center py-12 card">
                <BookOpen size={32} className="mx-auto text-secondary-400 dark:text-secondary-600 mb-3" />
                <h3 className="text-xl font-medium text-secondary-600 dark:text-secondary-400 mb-2">No stories yet</h3>
                <p className="text-secondary-500 dark:text-secondary-500 mb-4">Start sharing your thoughts with the world</p>
                <Link to="/create" className="btn-primary text-sm inline-flex">
                  <Edit size={16} className="mr-2" />
                  Write your first story
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.map((post) => (
                  <div key={post.id} className="card aspect-square overflow-hidden relative group">
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/post/${post.id}`}
                        className="p-2 bg-white dark:bg-secondary-700 rounded-full text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deleteLoading === post.id}
                        className="p-2 bg-white dark:bg-secondary-700 rounded-full text-secondary-600 dark:text-secondary-300 hover:text-red-600 dark:hover:text-red-400 shadow-sm"
                      >
                        {deleteLoading === post.id ? (
                          <div className="w-4 h-4 border-2 border-secondary-300 border-t-secondary-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                    
                    <Link to={`/post/${post.id}`} className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-serif font-bold mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {post.title}
                      </h3>
                      <time className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </time>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm line-clamp-4 flex-grow">
                        {stripHtml(post.content)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <>
            {myComments.length === 0 ? (
              <div className="text-center py-12 card">
                <MessageSquare size={32} className="mx-auto text-secondary-400 dark:text-secondary-600 mb-3" />
                <h3 className="text-xl font-medium text-secondary-600 dark:text-secondary-400">No comments yet</h3>
                <p className="text-secondary-500 dark:text-secondary-500">Join the conversation by commenting on stories</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myComments.map((comment) => (
                  <div key={comment.id} className="card p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <Link 
                        to={`/post/${comment.post_id}`}
                        className="text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        On: {comment.post.title}
                      </Link>
                      <time className="text-sm text-secondary-500 dark:text-secondary-400">
                        {format(new Date(comment.created_at), 'MMM d, yyyy, h:mm a')}
                      </time>
                    </div>
                    <p className="text-secondary-700 dark:text-secondary-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}