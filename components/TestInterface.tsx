
import React, { useState, useEffect, useRef } from 'react';
import { QuestionPaper, PaperConfig, TestHistoryEntry } from '../types';

interface TestInterfaceProps {
  paper: QuestionPaper;
  config: PaperConfig;
  onSubmit: (entry: TestHistoryEntry) => void;
  onExit: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ paper, config, onSubmit, onExit }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubjectiveAnswers, setShowSubjectiveAnswers] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(config.duration * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let score;
    // Check for MCQ or Mixed to calculate score
    if (config.type !== 'subjective') {
      let obtained = 0;
      let total = 0;
      
      paper.sections.forEach(section => {
        section.questions.forEach(q => {
          // Robust type checking
          const isMCQ = q.type.toLowerCase().includes('mcq') || (q.options && q.options.length > 0);
          if (isMCQ) {
            total += q.marks;
            if (answers[q.id] === q.correctAnswer) {
              obtained += q.marks;
            }
          }
        });
      });

      score = {
        obtained,
        total,
        percentage: total > 0 ? Math.round((obtained / total) * 100) : 0
      };
    }

    const entry: TestHistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      config,
      paper,
      userAnswers: answers,
      score
    };

    onSubmit(entry);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    const optionLabels = ['A', 'B', 'C', 'D'];
    setAnswers({ ...answers, [questionId]: optionLabels[optionIndex] });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <header className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-gray-200 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg border ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70 leading-none mb-1">Time Left</span>
            <span className="text-xl font-mono font-bold leading-none">{formatTime(timeLeft)}</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{paper.title}</h1>
            <p className="text-xs text-gray-500">{config.classLevel} • {config.region}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExit}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Exit
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="prose prose-sm max-w-none mb-8 text-gray-600 italic border-l-2 border-gray-200 pl-4 py-1">
        {paper.instructions}
      </div>

      <div className="space-y-12">
        {paper.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>{section.name}</span>
              <span className="text-xs font-medium text-gray-400">Total Marks: {section.marks}</span>
            </h2>

            <div className="space-y-8">
              {section.questions.map((q, qIdx) => {
                const isMCQ = q.type.toLowerCase().includes('mcq') || (q.options && q.options.length > 0);
                const isSubjective = !isMCQ;

                return (
                  <div key={q.id} className="space-y-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between gap-4">
                      <p className="text-gray-800 leading-relaxed font-medium">
                        <span className="font-bold mr-2 text-gray-400">{qIdx + 1}.</span> {q.text}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 shrink-0 bg-gray-100 px-2 py-1 rounded h-fit self-start">[{q.marks}M]</span>
                    </div>

                    {isMCQ && q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {q.options.map((option, oIdx) => {
                          const label = ['A', 'B', 'C', 'D'][oIdx];
                          const isSelected = answers[q.id] === label;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`flex items-center text-left p-4 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'bg-gray-900 border-gray-900 text-white shadow-md scale-[1.01]' 
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold shrink-0 ${
                                isSelected ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {label}
                              </span>
                              <span className="text-sm">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isSubjective && (
                      <div className="space-y-4 mt-2">
                        <textarea 
                          placeholder="Type your answer here..."
                          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none h-32 shadow-sm"
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          value={answers[q.id] || ''}
                        />
                        {showSubjectiveAnswers && (
                          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-xl animate-in slide-in-from-left-2 duration-300">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reference Answer Key</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{q.modelAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-50 lg:hidden shadow-lg">
        <button 
          onClick={handleSubmit}
          className="bg-gray-900 text-white w-full max-w-sm py-4 rounded-xl font-bold active:scale-95 transition-all"
        >
          Submit Test
        </button>
      </div>

      {(config.type === 'subjective' || config.type === 'mixed') && (
        <div className="mt-12 text-center pb-8">
          <button 
            onClick={() => setShowSubjectiveAnswers(!showSubjectiveAnswers)}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            <svg className={`w-4 h-4 transition-transform ${showSubjectiveAnswers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showSubjectiveAnswers ? 'Hide Answer Key' : 'Show Answer Key'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestInterface;
