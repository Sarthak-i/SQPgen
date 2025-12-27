
import React from 'react';
import { TestHistoryEntry } from '../types';

interface ResultsViewProps {
  entry: TestHistoryEntry;
  onGenerateAnother: () => void;
  onBackToDashboard: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ entry, onGenerateAnother, onBackToDashboard }) => {
  const { score, paper, userAnswers, config } = entry;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Test Completed</h1>
        {score ? (
          <div className="inline-block bg-white p-8 rounded-full border-8 border-gray-50 shadow-inner relative">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-gray-900">{score.percentage}%</span>
              <span className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Final Score</span>
            </div>
            {score.percentage >= 80 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
                🏆
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 inline-block px-6 py-3 rounded-full text-gray-500 font-medium">
            Self-Evaluation Mode
          </div>
        )}
      </header>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <button 
          onClick={onGenerateAnother}
          className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          Generate Another
        </button>
        <button 
          onClick={onBackToDashboard}
          className="flex-1 bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Review Questions</h2>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{paper.title}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {paper.sections.map((section) => 
            section.questions.map((q, idx) => {
              const userAnswer = userAnswers[q.id];
              const isMCQ = q.type.toLowerCase().includes('mcq') || (q.options && q.options.length > 0);
              const isCorrect = isMCQ && userAnswer === q.correctAnswer;
              
              return (
                <div key={q.id} className="p-6 space-y-4">
                  <div className="flex justify-between gap-4">
                    <p className="text-gray-800 leading-relaxed font-semibold">
                      <span className="text-gray-300 mr-2">{idx + 1}.</span> {q.text}
                    </p>
                    {isMCQ && (
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider self-start shrink-0 ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {isMCQ && q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => {
                        const label = ['A', 'B', 'C', 'D'][oIdx];
                        const isSelected = userAnswer === label;
                        const isCorrectOption = q.correctAnswer === label;
                        
                        let cardClass = "border border-gray-100 bg-gray-50 text-gray-500 opacity-60";
                        if (isSelected && isCorrectOption) cardClass = "bg-green-50 border-green-200 text-green-700 ring-1 ring-green-200 opacity-100";
                        else if (isSelected && !isCorrectOption) cardClass = "bg-red-50 border-red-200 text-red-700 opacity-100";
                        else if (!isSelected && isCorrectOption) cardClass = "bg-green-50 border-green-200 text-green-700 border-dashed opacity-100";

                        return (
                          <div key={oIdx} className={`p-4 rounded-xl text-sm flex items-center gap-3 transition-all ${cardClass}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected || isCorrectOption ? 'bg-white' : 'bg-gray-200'
                            }`}>
                              {label}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectOption && <span className="text-lg font-bold">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!isMCQ && (
                    <div className="space-y-4">
                      {userAnswer && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Your Answer</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{userAnswer}</p>
                        </div>
                      )}
                      <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                        <p className="text-[10px] font-bold text-green-600 uppercase mb-2">Ideal Solution / Marking Scheme</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{q.modelAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
