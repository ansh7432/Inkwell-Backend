import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { BookOpen, Calendar, User, ArrowRight, Sparkles, Crown } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts((data || []).map(post => ({
        ...post,
        profiles: post.profiles?.[0] || { username: '', avatar_url: '' }
      })));
      setLoading(false);
    }

    fetchPosts();
  }, []);

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="luxury-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-dot"></div>
          <BookOpen size={24} className="text-primary-500 dark:text-primary-400 absolute" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section with Glass Effect */}
      <div className="luxury-hero relative mb-24 rounded-2xl overflow-hidden">
        <div className="luxury-gradient absolute inset-0 bg-gradient-to-br from-primary-500/90 via-primary-600/80 to-secondary-700/90 dark:from-primary-600/90 dark:via-primary-700/80 dark:to-secondary-800/90"></div>
        <div className="luxury-noise absolute inset-0 opacity-10"></div>
        
        {/* Animated accents */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        <div className="relative z-10 py-16 md:py-24 px-6 md:px-12 text-center">
          <h1 className="luxury-title text-5xl md:text-7xl font-serif font-bold mb-6 text-white">
            <span>Story</span>
            <span className="relative ml-1">
              <span className="luxury-highlight">Blog</span>
              <Crown size={18} className="absolute -top-8 -right-4 text-yellow-300 opacity-80 transform rotate-12 animate-pulse-slow" />
            </span>
          </h1>
          
          <p className="luxury-subtitle text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover a curated collection of extraordinary stories and insights from talented writers
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/create" className="luxury-button-primary">
              <span className="text-white">Start Writing</span>
            </Link>
            <a href="#stories" className="luxury-button-secondary">
              <span className="text-mode-adaptive">Explore Stories</span>
            </a>
          </div>
        </div>
        
        {/* Decorative curve at the bottom */}
        <svg className="absolute bottom-0 left-0 right-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgb(255,255,255)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 right-0 dark:block hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgb(30, 41, 59)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div id="stories" className="pt-12">
        {posts.length === 0 ? (
          <div className="luxury-empty text-center py-16 card backdrop-blur-sm border border-primary-100 dark:border-primary-800/40">
            <div className="luxury-empty-icon mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/30 shadow-inner">
              <BookOpen size={40} className="text-primary-400 dark:text-primary-600/70" />
            </div>
            <h3 className="text-2xl font-serif font-medium text-secondary-700 dark:text-secondary-300 mb-3">No stories available yet</h3>
            <p className="text-secondary-500 dark:text-secondary-400 max-w-md mx-auto mb-8">Our collection is waiting for your premium content. Be the first to contribute an extraordinary story!</p>
            <Link to="/create" className="luxury-button-primary inline-flex">
              <span className="text-white mr-2">Write Your First Story</span>
              <ArrowRight size={18} className="text-white" />
            </Link>
          </div>
        ) : (
          <>
            <div className="luxury-header mb-12">
              <h2 className="luxury-section-title">Featured Stories</h2>
              <div className="luxury-divider">
                <span className="luxury-divider-icon">
                  <Sparkles size={14} />
                </span>
              </div>
            </div>
            
            <div className="luxury-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
              {posts.map((post, index) => (
                <Link key={post.id} to={`/post/${post.id}`} className="group block h-full perspective-500">
                  <article className="luxury-card relative flex flex-col aspect-square h-full transform transition-transform duration-500 preserve-3d hover:translate-z-8">
                    {/* Card glass shine effect */}
                    <div className="absolute inset-0 luxury-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Premium indicator for first 3 posts */}
                    {index < 3 && (
                      <div className="luxury-premium absolute -top-3 -right-3 z-20">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 dark:from-yellow-400 dark:to-yellow-600 rounded-full shadow-lg flex items-center justify-center transform rotate-12">
                          <Crown size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8 flex flex-col h-full relative z-10">
                      <h2 className="luxury-card-title text-2xl font-serif font-bold mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <div className="luxury-card-meta flex items-center gap-4 text-secondary-500 dark:text-secondary-400 mb-5">
                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-white dark:from-primary-900 dark:to-secondary-800 flex items-center justify-center mr-2 shadow-sm">
                            <User size={14} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="font-medium truncate">{post.profiles.username}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-white dark:from-primary-900 dark:to-secondary-800 flex items-center justify-center mr-2 shadow-sm">
                            <Calendar size={14} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <time>{format(new Date(post.created_at), 'MMM d, yyyy')}</time>
                        </div>
                      </div>
                      
                      <div className="luxury-card-content relative mb-4 flex-grow">
                        <p className="text-secondary-600 dark:text-secondary-400 line-clamp-3 text-base">
                          {stripHtml(post.content)}
                        </p>
                        {/* Gradient fade at bottom of excerpt */}
                        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white dark:from-secondary-800 to-transparent"></div>
                      </div>
                      
                      <div className="luxury-card-footer mt-auto pt-5 border-t border-secondary-100 dark:border-secondary-800/60">
                        <div className="inline-flex items-center font-medium text-primary-600 dark:text-primary-400 text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-all">
                          <span>Read full story</span>
                          <div className="ml-2 w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center transition-transform duration-300 transform group-hover:translate-x-1">
                            <ArrowRight size={14} className="text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card border glow */}
                    <div className="absolute inset-0 rounded-xl luxury-card-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Decorative floating elements */}
      <div className="luxury-floating-shape absolute -z-10 top-1/4 left-10 w-72 h-72 bg-primary-200/20 dark:bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="luxury-floating-shape absolute -z-10 bottom-32 right-10 w-80 h-80 bg-primary-100/20 dark:bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
      
      {/* Bottom call to action */}
      <div className="luxury-cta mt-20 mb-16">
        <div className="luxury-cta-card relative overflow-hidden rounded-2xl p-10 md:p-12">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/90 via-primary-50/90 to-white dark:from-primary-900/90 dark:via-primary-800/80 dark:to-secondary-800/90 backdrop-filter backdrop-blur-sm"></div>
          
          {/* Animated accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-primary-300/20 to-transparent dark:from-primary-400/10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-primary-300/20 to-transparent dark:from-primary-400/10 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="luxury-cta-title text-3xl md:text-4xl font-serif font-bold mb-6 text-secondary-900 dark:text-white">Ready to share your story?</h3>
            <p className="luxury-cta-text text-lg mb-8 text-secondary-600 dark:text-secondary-300">Join our community of talented writers and readers. Create an account to publish your own stories and connect with others.</p>
            <div className="flex justify-center">
              <Link to="/register" className="luxury-button-primary">
                <span className="text-white">Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}