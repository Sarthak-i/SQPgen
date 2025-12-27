
import React, { useState } from 'react';
import { PaperConfig, PaperType } from '../types';

interface PaperFormProps {
  onGenerate: (config: PaperConfig) => void;
  onCancel: () => void;
}

const PaperForm: React.FC<PaperFormProps> = ({ onGenerate, onCancel }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<PaperConfig>({
    type: 'mcq',
    duration: 30,
    questionCount: 10,
    totalMarks: 50,
    classLevel: '',
    region: '',
    difficulty: 3,
    topics: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const isStep1Valid = config.type && config.duration > 0 && config.questionCount > 0 && config.totalMarks > 0;
  const isStep2Valid = config.classLevel && config.region && config.topics;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Your Paper</h1>
          <p className="text-gray-500">Step {step} of 3</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          Cancel
        </button>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
              <select 
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value as PaperType })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="mcq">MCQ / OMR (Auto-graded)</option>
                <option value="subjective">Subjective / Written (Answer Key Provided)</option>
                <option value="mixed">Mixed Format</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
                <input 
                  type="number"
                  value={config.duration}
                  onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
                <input 
                  type="number"
                  value={config.questionCount}
                  onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                <input 
                  type="number"
                  value={config.totalMarks}
                  onChange={(e) => setConfig({ ...config, totalMarks: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button 
              disabled={!isStep1Valid}
              onClick={handleNext}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class / Grade</label>
                <input 
                  placeholder="e.g. Class 10"
                  value={config.classLevel}
                  onChange={(e) => setConfig({ ...config, classLevel: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region / Country</label>
                <input 
                  placeholder="e.g. India, CBSE"
                  value={config.region}
                  onChange={(e) => setConfig({ ...config, region: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level ({config.difficulty}/5)</label>
              <input 
                type="range"
                min="1"
                max="5"
                step="1"
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Easy</span>
                <span>Hard</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
              <textarea 
                rows={3}
                placeholder="Algebra, Trigonometry, Calculus..."
                value={config.topics}
                onChange={(e) => setConfig({ ...config, topics: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
              >
                Back
              </button>
              <button 
                disabled={!isStep2Valid}
                onClick={handleNext}
                className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-lg text-gray-900">Review Parameters</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Type</span>
                <span className="text-gray-700 font-medium capitalize">{config.type}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Duration</span>
                <span className="text-gray-700 font-medium">{config.duration} Minutes</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Total Marks</span>
                <span className="text-gray-700 font-medium">{config.totalMarks} Marks</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Class</span>
                <span className="text-gray-700 font-medium">{config.classLevel}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Difficulty</span>
                <span className="text-gray-700 font-medium">{config.difficulty}/5</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Question Count</span>
                <span className="text-gray-700 font-medium">{config.questionCount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 block uppercase text-[10px] font-bold tracking-wider">Topics</span>
                <span className="text-gray-700 font-medium">{config.topics}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => onGenerate(config)}
                className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all active:scale-95"
              >
                Confirm & Generate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperForm;
