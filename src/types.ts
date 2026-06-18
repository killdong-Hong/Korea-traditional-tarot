export interface SajuPillar {
  stem: string;
  branch: string;
  stemKorean: string;
  branchKorean: string;
  element: string;
}

export interface WuXingData {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  [key: string]: number;
}

export interface SajuAnalysisResult {
  yearPillar: SajuPillar;
  monthPillar: SajuPillar;
  dayPillar: SajuPillar;
  hourPillar: SajuPillar;
  wuXing: WuXingData;
  yongShin: string;
  gyeokGuk: string;
  characterSummary: string;
  analysis: {
    personality: string;
    career: string;
    wealth: string;
    love: string;
  };
  message: string;
  isFallback?: boolean;
}

export interface SajuProfile {
  name: string;
  gender: 'M' | 'F';
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  calendarType: 'solar' | 'lunar';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CoachPersona {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  greeting: string;
  gradient: string;
}

export interface ChemistryResult {
  score: number;
  wuXingHarmony: string;
  affinityType: string;
  analysis: string;
  conflictAdvice: string;
}

export interface SajuInsightsResult {
  yearlyForecast: string;
  monthlyScores: number[];
}
