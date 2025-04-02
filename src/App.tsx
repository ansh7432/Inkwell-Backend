import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-10 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/post/:id/edit" element={<EditPost />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800 py-6 transition-colors duration-300">
              <div className="container mx-auto px-4 text-center text-secondary-500 dark:text-secondary-400">
                <p>© {new Date().getFullYear()} InkWell. All rights reserved.</p>
              </div>
            </footer>
            <ChatBot />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;