import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hi there! I'm StoryBot, your blog assistant. How can I help you today?",
  sender: 'bot',
  timestamp: new Date(),
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to generate AI responses
  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Simulate AI-generated responses with pattern matching
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return "Hello! How can I assist you with the blog today?";
    }
    
    if (lowerQuestion.includes('help')) {
      return "I can help you navigate the blog, find stories, or answer questions about the content. What would you like to know?";
    }
    
    if (lowerQuestion.includes('about') && lowerQuestion.includes('blog')) {
      return "Inkwell is a platform where users can share their stories, experiences, and insights. Users can create accounts, write posts, comment on others' stories, and save their favorites.";
    }
    
    if (lowerQuestion.includes('write') || lowerQuestion.includes('post') || lowerQuestion.includes('story')) {
      return "To create a new story, click the 'Write Story' button in the navigation bar. You'll need to be logged in to publish your content.";
    }
    
    if (lowerQuestion.includes('account') || lowerQuestion.includes('sign up') || lowerQuestion.includes('register')) {
      return "To create an account, click 'Join Now' in the navigation bar. You'll need to provide a username, email, and password.";
    }
    
    if (lowerQuestion.includes('login') || lowerQuestion.includes('sign in')) {
      return "You can sign in by clicking the 'Login' button in the navigation bar and entering your credentials.";
    }
    
    if (lowerQuestion.includes('dashboard')) {
      return "The dashboard shows all your stories and comments. You can access it by clicking your profile icon in the navigation bar after logging in.";
    }
    
    if (lowerQuestion.includes('comment')) {
      return "You can comment on any story by scrolling to the bottom of the post and typing in the comment box. You need to be logged in to comment.";
    }
    
    if (lowerQuestion.includes('thank')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
    }
    
    if (lowerQuestion.includes('dark mode') || lowerQuestion.includes('light mode') || lowerQuestion.includes('theme')) {
      return `You can toggle between dark and light mode by clicking the ${theme === 'dark' ? 'sun' : 'moon'} icon in the navigation bar.`;
    }
    
    // Default response
    return "I'm not sure I understand. Could you ask in a different way? I can help with navigation, finding stories, or answering questions about the blog.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking and typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90'
            : 'bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 animate-bounce-slow'
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageSquare size={24} className="text-white" />
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[450px] bg-white dark:bg-secondary-800 rounded-lg shadow-elevated overflow-hidden flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-primary-600 dark:bg-primary-700 text-white p-3 flex items-center">
            <Bot size={20} className="mr-2" />
            <span className="font-medium">StoryBot Assistant</span>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-100'
                      : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary-100 dark:bg-secondary-700 rounded-lg px-4 py-2 max-w-[85%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-secondary-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-secondary-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-secondary-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-secondary-200 dark:border-secondary-700 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 form-input py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`ml-2 p-2 rounded-lg ${
                inputValue.trim() && !isTyping
                  ? 'bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600'
                  : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}