import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare, LogOut, LogIn, UserPlus, BookOpen, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-secondary-900/95 shadow-lg backdrop-blur-lg py-3' 
        : 'bg-white/60 dark:bg-secondary-900/80 backdrop-blur-md py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="luxury-logo-container relative">
              <div className="luxury-logo-bg absolute inset-0 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/50 transform transition-transform duration-300 group-hover:scale-110"></div>
              <div className="luxury-logo relative w-9 h-9 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform duration-300 transform group-hover:scale-110" />
              </div>
            </div>
            <span className="text-xl font-serif font-bold text-secondary-900 dark:text-white tracking-tight">
              StoryBlog
              <span className="hidden sm:inline text-primary-600 dark:text-primary-400">.</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="luxury-theme-toggle p-2 rounded-full bg-secondary-50 dark:bg-secondary-800/70 text-secondary-500 dark:text-secondary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-sm hover:shadow"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 
                <Sun size={18} className="transition-transform duration-300 hover:rotate-45" /> : 
                <Moon size={18} className="transition-transform duration-300 hover:rotate-12" />
              }
            </button>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="luxury-nav-button btn-primary text-sm"
                >
                  <PenSquare size={18} className="mr-2" />
                  <span>Write Story</span>
                </Link>
                
                <div className="luxury-user-menu relative group">
                  <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/70 transition-colors group-hover:bg-secondary-50 dark:group-hover:bg-secondary-800/70">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-800 dark:to-primary-900 flex items-center justify-center border-2 border-white dark:border-secondary-900 shadow-sm">
                      <User size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-secondary-900 dark:group-hover:text-white">
                      Account
                    </span>
                    <ChevronDown size={16} className="text-secondary-500 dark:text-secondary-400 transition-transform duration-300 group-hover:rotate-180" />
                  </div>
                  
                  <div className="absolute right-0 mt-1 w-48 py-2 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-100 dark:border-secondary-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                    >
                      Settings
                    </Link>
                    <div className="my-1 border-t border-secondary-100 dark:border-secondary-700"></div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="luxury-nav-link flex items-center gap-2 py-2 px-3 rounded-lg text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/70 transition-all duration-300"
                >
                  <LogIn size={18} />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="luxury-nav-button btn-primary text-sm"
                >
                  <UserPlus size={18} className="mr-2" />
                  <span>Join Now</span>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-secondary-50 dark:bg-secondary-800/70 text-secondary-500 dark:text-secondary-400"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="luxury-menu-button p-1 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/70"
            >
              <div className={`w-6 flex flex-col items-end justify-center gap-1.5 transition-all ${menuOpen ? 'gap-0' : ''}`}>
                <span className={`h-0.5 bg-secondary-600 dark:bg-secondary-300 rounded-full transition-all duration-300 ${menuOpen ? 'w-6 transform rotate-45 translate-y-1' : 'w-6'}`}></span>
                <span className={`h-0.5 bg-secondary-600 dark:bg-secondary-300 rounded-full transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100 w-4'}`}></span>
                <span className={`h-0.5 bg-secondary-600 dark:bg-secondary-300 rounded-full transition-all duration-300 ${menuOpen ? 'w-6 transform -rotate-45 -translate-y-1' : 'w-5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white dark:bg-secondary-900 shadow-lg border-t border-secondary-100 dark:border-secondary-800 transition-all duration-300 ${
        menuOpen ? 'max-h-96 opacity-100 border-opacity-100' : 'max-h-0 opacity-0 border-opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 py-4">
          {user ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center p-2 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-800 dark:to-primary-900 flex items-center justify-center border-2 border-white dark:border-secondary-900 mr-3">
                  <User size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-white">{user.email}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">Logged in</div>
                </div>
              </div>
              
              <Link
                to="/dashboard"
                className="flex items-center p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 text-secondary-700 dark:text-secondary-300"
              >
                <User size={18} className="mr-3 text-primary-600 dark:text-primary-400" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/create"
                className="flex items-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
              >
                <PenSquare size={18} className="mr-3" />
                <span className="font-medium">Write Story</span>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="flex items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-secondary-700 dark:text-secondary-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut size={18} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                className="flex items-center p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 text-secondary-700 dark:text-secondary-300"
              >
                <LogIn size={18} className="mr-3 text-primary-600 dark:text-primary-400" />
                <span>Login</span>
              </Link>
              
              <Link
                to="/register"
                className="flex items-center justify-center p-3 rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-medium"
              >
                <UserPlus size={18} className="mr-2" />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}