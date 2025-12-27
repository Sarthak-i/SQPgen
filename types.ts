
export type PaperType = 'mcq' | 'subjective' | 'mixed';

export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'subjective';
  marks: number;
  options?: string[]; // For MCQ
  correctAnswer?: string; // For MCQ (e.g., 'A', 'B', 'C', 'D')
  modelAnswer?: string; // For Subjective
}

export interface Section {
  name: string;
  marks: number;
  questions: Question[];
}

export interface QuestionPaper {
  title: string;
  instructions: string;
  sections: Section[];
}

export interface PaperConfig {
  type: PaperType;
  duration: number;
  questionCount: number;
  totalMarks: number;
  classLevel: string;
  region: string;
  difficulty: number;
  topics: string;
}

export interface TestHistoryEntry {
  id: string;
  timestamp: number;
  config: PaperConfig;
  paper: QuestionPaper;
  userAnswers: Record<string, string>; // questionId -> answer
  score?: {
    obtained: number;
    total: number;
    percentage: number;
  };
}

export type AppView = 'login' | 'dashboard' | 'create' | 'test' | 'results' | 'history';

export interface User {
  name: string;
  email: string;
  avatar: string;
}
