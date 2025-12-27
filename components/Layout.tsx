
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onGoHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onGoHome }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={onGoHome}
            >
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">SQP</span>
              </div>
              <span className="font-semibold text-gray-900">Generator</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className={`p-4 sm:p-8 ${user ? 'max-w-6xl mx-auto' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
