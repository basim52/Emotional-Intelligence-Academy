export interface Option {
  id: string;
  text: string;
  score: number; // 1 to 5
}

export interface Question {
  id: number;
  text: string;
  category: "awareness" | "regulation" | "empathy" | "communication";
  options: Option[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: "spouse" | "children" | "extended" | "self";
  iconName: string;
  problem: string;
  role: string;
  difficulty: "easy" | "medium" | "hard";
  initialMessage: string;
}

export interface SimulationTurn {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface SimulationSession {
  caseId: string;
  turns: SimulationTurn[];
  analysis?: {
    eqScore: number; // 1-100
    empathyLevel: string; // low, medium, high
    strengths: string[];
    gaps: string[];
    betterWording: string;
    generalAdvice: string;
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string; // 😊, 😔, 😠, 🤯, 🧘
  situation: string;
  reaction: string;
  reflection: string;
  goals: string[];
  triggerTag?: string; // e.g., 'children', 'spouse', 'work', 'money', 'silent'
}

export interface CourseLesson {
  id: string;
  lessonNum: number; // 1 to 15
  title: string;
  duration: string;
  subtitle: string;
  content: string; // Detailed intensive written contents
  exercise: string; // Real-world assignment/homework
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface CourseChapter {
  id: string;
  chapterNum: number; // 1 to 5
  title: string;
  icon: string;
  description: string;
  lessons: CourseLesson[];
  quiz: {
    title: string;
    description: string;
    questions: QuizQuestion[];
  };
}

