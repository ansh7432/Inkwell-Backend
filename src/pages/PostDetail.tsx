import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, MessageSquare, ArrowLeft, Heart, Share2, Bookmark, Edit } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  like_count: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    
    async function fetchPost() {
      setLoading(true);
      setError('');

      try {
        // Fetch post data
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (postError) throw postError;

        // Fetch comments
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles (
              username,
              avatar_url
            )
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        setPost(post);
        setLikesCount(post.like_count || 0);
        setComments(comments || []);

        // Check if user has liked this post
        if (user) {
          const { data: likeData, error: likeError } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', id)
            .eq('user_id', user.id)
            .single();

          if (likeError && likeError.code !== 'PGRST116') {
            console.error('Error checking like status:', likeError);
          } else {
            setLiked(!!likeData);
          }
          
          // Check if user has bookmarked this post
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('post_id', id)
            .eq('user_id', user.id)
            .single();
            
          if (bookmarkError && bookmarkError.code !== 'PGRST116') {
            console.error('Error checking bookmark status:', bookmarkError);
          } else {
            setBookmarked(!!bookmarkData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, user]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    try {
      setCommenting(true);
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([
          {
            content: newComment.trim(),
            post_id: id,
            author_id: user.id,
          }
        ])
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    } finally {
      setCommenting(false);
    }
  }

  async function handleLikeToggle() {
    if (!user || !id || likeLoading) return;
    
    try {
      setLikeLoading(true);
      
      if (liked) {
        // Unlike post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Update like count in posts table
        await supabase.rpc('decrement_likes', { post_id: id });
        
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like post
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: id, user_id: user.id }]);
          
        if (error) throw error;
        
        // Update like count in posts table
        await supabase.rpc('increment_likes', { post_id: id });
        
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Failed to update like status');
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleBookmarkToggle() {
    if (!user || !id || bookmarkLoading) return;
    
    try {
      setBookmarkLoading(true);
      
      if (bookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setBookmarked(false);
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ post_id: id, user_id: user.id }]);
          
        if (error) throw error;
        
        setBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setError('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Check out this post',
          text: 'I found this interesting article on Inkwell',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
        <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg mb-6">
          <p className="font-medium">Post not found</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="card p-8 mb-8 slide-up">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold animate-fade-in">{post.title}</h1>
          {user && user.id === post.author_id && (
            <Link
              to={`/post/${post.id}/edit`}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <Edit size={20} />
              <span>Edit</span>
            </Link>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-secondary-500 dark:text-secondary-400 mb-8 pb-6 border-b border-secondary-100 dark:border-secondary-700">
          <div className="flex items-center">
            <User size={18} className="mr-2" />
            <span className="font-medium">{post.profiles.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="mr-2" />
            <time>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 slide-up stagger-1">
          <button 
            onClick={handleLikeToggle}
            disabled={!user || likeLoading}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              liked 
                ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                : 'text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={liked ? "Unlike this post" : "Like this post"}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} />
            <span className="font-medium">{likesCount}</span>
          </button>
          
          <button 
            onClick={handleBookmarkToggle}
            disabled={!user || bookmarkLoading}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              bookmarked 
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                : 'text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
          >
            <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
            <span className="font-medium">Save</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 p-2 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all ml-auto"
            aria-label="Share this post"
          >
            <Share2 size={20} />
            <span className="font-medium">Share</span>
          </button>
        </div>

        <div className="decorative-line slide-up stagger-2"></div>
        
        <div 
          className="prose-custom story-content slide-up stagger-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="card p-8 slide-up stagger-3">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={24} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-serif font-bold">Comments</h2>
        </div>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-input w-full resize-none focus:ring-2"
              placeholder="Share your thoughts..."
              rows={4}
            />
            <button
              type="submit"
              disabled={commenting || !newComment.trim()}
              className="btn-primary mt-3"
            >
              {commenting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-secondary-50 dark:bg-secondary-800/60 rounded-xl border border-secondary-100 dark:border-secondary-700">
            <p className="text-secondary-600 dark:text-secondary-300 text-center">
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">Sign in</Link> to join the conversation.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-secondary-500 dark:text-secondary-400 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment, index) => (
              <div 
                key={comment.id} 
                className={`pb-6 border-b border-secondary-100 dark:border-secondary-700 last:border-b-0 last:pb-0 slide-up`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center text-secondary-500 dark:text-secondary-300">
                    {comment.profiles.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">{comment.profiles.username}</p>
                    <time className="text-sm text-secondary-500 dark:text-secondary-400">
                      {format(new Date(comment.created_at), 'MMM d, yyyy')}
                    </time>
                  </div>
                </div>
                <p className="text-secondary-700 dark:text-secondary-300 pl-[52px]">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}