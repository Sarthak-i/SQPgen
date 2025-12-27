
import React, { useState, useEffect } from 'react';
import { User, AppView, TestHistoryEntry, PaperConfig, QuestionPaper } from './types';
import { getSession, setSession, clearSession, getHistory, saveHistory } from './utils/storage';
import { generatePaper } from './services/geminiService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PaperForm from './components/PaperForm';
import TestInterface from './components/TestInterface';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Current session/state
  const [activePaper, setActivePaper] = useState<{paper: QuestionPaper, config: PaperConfig} | null>(null);
  const [activeResults, setActiveResults] = useState<TestHistoryEntry | null>(null);

  useEffect(() => {
    const savedUser = getSession();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }
    setHistory(getHistory());
  }, []);

  const handleMockLogin = () => {
    setIsLoggingIn(true);
    // Simulate a brief connection delay for a more realistic feel
    setTimeout(() => {
      const mockUser: User = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      };
      setUser(mockUser);
      setSession(mockUser);
      setView('dashboard');
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setView('login');
  };

  const handleGeneratePaper = async (config: PaperConfig) => {
    setLoading(true);
    try {
      const paper = await generatePaper(config);
      setActivePaper({ paper, config });
      setView('test');
    } catch (err) {
      alert("Failed to generate paper. Please try again or check your topics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubmit = (entry: TestHistoryEntry) => {
    saveHistory(entry);
    setHistory(getHistory());
    setActiveResults(entry);
    setView('results');
  };

  const handleReviewTest = (entry: TestHistoryEntry) => {
    setActiveResults(entry);
    setView('results');
  };

  const renderView = () => {
    if (view === 'login') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full space-y-12 text-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 bg-gray-900 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform cursor-default">
                <span className="text-white text-3xl font-black">SQP</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SQP Generator</h1>
                <p className="text-gray-500 font-medium max-w-[280px] mx-auto">
                  The simplest way to create and grade sample papers with AI.
                </p>
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <button 
                disabled={isLoggingIn}
                onClick={handleMockLogin}
                className="w-full bg-white border border-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] shadow-sm relative overflow-hidden group"
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Get Started with Google</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl">✨</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">AI Powered</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xl">🎯</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Auto Grade</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xl">📄</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ready to Print</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] animate-pulse">
              Minimal • Professional • Efficient
            </p>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-gray-900">AI</div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Crafting Your Paper</h2>
            <p className="text-gray-400 max-w-xs mx-auto">Drafting curriculum-aligned questions and generating marking schemes...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            history={history} 
            onCreateNew={() => setView('create')} 
            onViewHistory={() => setView('history')}
            onReviewTest={handleReviewTest}
          />
        );
      case 'create':
        return (
          <PaperForm 
            onGenerate={handleGeneratePaper} 
            onCancel={() => setView('dashboard')} 
          />
        );
      case 'test':
        return activePaper ? (
          <TestInterface 
            paper={activePaper.paper} 
            config={activePaper.config} 
            onSubmit={handleTestSubmit}
            onExit={() => setView('dashboard')}
          />
        ) : null;
      case 'results':
        return activeResults ? (
          <ResultsView 
            entry={activeResults} 
            onGenerateAnother={() => handleGeneratePaper(activeResults.config)}
            onBackToDashboard={() => setView('dashboard')}
          />
        ) : null;
      case 'history':
        return (
          <HistoryView 
            history={history} 
            onReview={handleReviewTest}
            onBack={() => setView('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onGoHome={() => setView('dashboard')}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
