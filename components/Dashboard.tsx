
import React from 'react';
import { TestHistoryEntry } from '../types';

interface DashboardProps {
  history: TestHistoryEntry[];
  onCreateNew: () => void;
  onViewHistory: () => void;
  onReviewTest: (test: TestHistoryEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onCreateNew, onViewHistory, onReviewTest }) => {
  const totalTests = history.length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score?.percentage || 0), 0) / history.length)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your recent activity.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Tests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Score</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgScore}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Tests Completed</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i <= totalTests ? 'bg-purple-500' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onCreateNew}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Paper
        </button>
        <button 
          onClick={onViewHistory}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View History
        </button>
      </div>

      {/* Recent Tests */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tests</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {history.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {history.slice(0, 3).map((test) => (
                <div 
                  key={test.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                  onClick={() => onReviewTest(test)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.paper.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(test.timestamp).toLocaleDateString()} • {test.config.topics.split(',')[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    {test.config.type === 'mcq' || test.config.type === 'mixed' ? (
                      <span className={`text-sm font-bold ${test.score && test.score.percentage >= 70 ? 'text-green-600' : 'text-blue-600'}`}>
                        {test.score?.percentage}%
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 uppercase">Subjective</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p>No tests taken yet. Generate your first paper!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
