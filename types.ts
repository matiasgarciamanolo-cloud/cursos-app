export interface Pillar {
  id: string;
  title: string;
  description: string;
}

export interface Variation {
  id: string;
  title: string;
  focus: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface CourseBlock {
  title: string;
  content: string; // Markdown supported
  imageKeyword: string; // For searching placeholder images
  keyPoints: string[];
}

export interface CourseData {
  title: string;
  subtitle: string;
  themeColor: string; // Hex code
  blocks: CourseBlock[];
  quiz: QuizQuestion[];
  groundingSources?: GroundingSource[];
}

export enum AppStep {
  INPUT_TOPIC = 0,
  SELECT_PILLAR = 1,
  SELECT_VARIATION = 2,
  VIEW_COURSE = 3,
}

export interface AppState {
  step: AppStep;
  topic: string;
  pillars: Pillar[];
  selectedPillar: Pillar | null;
  variations: Variation[];
  selectedVariation: Variation | null;
  courseData: CourseData | null;
  isLoading: boolean;
  error: string | null;
}