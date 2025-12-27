
import React from 'react';
import { TestHistoryEntry } from '../types';

interface HistoryViewProps {
  history: TestHistoryEntry[];
  onReview: (entry: TestHistoryEntry) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onReview, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your History</h1>
          <p className="text-gray-500 mt-1">Review your last 5 generated papers.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </button>
      </header>

      <div className="space-y-4">
        {history.length > 0 ? history.map((test) => (
          <div 
            key={test.id} 
            onClick={() => onReview(test)}
            className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-900 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{test.paper.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  test.config.type === 'mcq' ? 'bg-blue-100 text-blue-700' :
                  test.config.type === 'subjective' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {test.config.type}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  📅 {new Date(test.timestamp).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  📚 {test.config.classLevel}
                </span>
                <span className="flex items-center gap-1">
                  📝 {test.config.questionCount} Questions
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{test.config.topics}</p>
            </div>

            <div className="flex items-center gap-6">
              {test.score && (
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">{test.score.percentage}%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
                </div>
              )}
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center space-y-4">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-lg font-bold text-gray-900">History Empty</p>
              <p className="text-gray-500">Your generated papers will appear here.</p>
            </div>
            <button 
              onClick={onBack}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Start Creating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
