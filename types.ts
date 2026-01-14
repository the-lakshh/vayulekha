
export interface UserProfile {
  name: string;
  phone: string;
}

export type AppMode = 'intro' | 'welcome' | 'profile' | 'choice' | 'tutorial' | 'drawing';

export interface Point {
  x: number;
  y: number;
  color: string;
  isNewStroke?: boolean;
}

export interface ColorOption {
  name: string;
  value: string;
}
