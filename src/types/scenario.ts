export interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  difficulty: 'Anfänger' | 'Fortgeschritten';
  formality: 'Sie' | 'Du';
  context: string;
  prompts: ScenarioPrompt[];
}

export interface ScenarioPrompt {
  id: string;
  german: string;
  english: string;
  keywords: string[];
  suggestedResponse: string;
}

export interface UserResponse {
  scenarioId: string;
  promptId: string;
  response: string;
  score: number;
  timestamp: number;
  attempts: number;
}

export interface FeedbackData {
  score: number;
  whatWorkedWell: string[];
  areasToImprove: string;
  suggestedResponse: string;
}

export interface ProgressData {
  completedScenarios: string[];
  responses: UserResponse[];
  totalScore: number;
}
