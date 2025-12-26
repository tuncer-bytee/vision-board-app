export type Category = 'education' | 'finance' | 'health' | 'social' | 'other';
export type GoalType = 'numeric' | 'streak';

export interface HistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: number;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: Category;
  type: GoalType;
  currentValue: number;
  targetValue: number;
  unit: string; 
  history: HistoryEntry[]; // Geçmiş veriler
}

export interface AIAdviceRequest {
  goalTitle: string;
  current: number;
  target: number;
  unit: string;
}