import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const { data: authData, error: authError } = await signUp(email, password);
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: username.trim(),
              email: authData.user.email,
            }
          ]);

        if (profileError) throw profileError;
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-icon-container">
          <div className="auth-icon-bg"></div>
          <UserPlus size={32} className="auth-icon" />
        </div>
        <h1 className="auth-title">Join Inkwell</h1>
        <p className="auth-subtitle slide-up stagger-1">Create an account to share your stories</p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded mb-6 flex items-start slide-up stagger-1">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10 slide-up stagger-2">
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
            />
            <label htmlFor="password">Password</label>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              Must be at least 6 characters
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center slide-up stagger-3">
        <p className="text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}