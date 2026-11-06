export interface Activity {
  id: string;
  iconName: string;
  iconCodePoint: number;
  iconFontFamily: string;
  iconFontPackage: string;
  label: string;
  question: string;
  answer: string;
  reciprocal: number; // default 6
  rewards: string[];
  createdAt: number;
}

export type OrderType =
  | 'createdAsc'
  | 'createdDesc'
  | 'questionAsc'
  | 'questionDesc'
  | 'labelAsc'
  | 'labelDesc'
  | 'userDefined'
  | 'random';

export type DarkThemeOption = 'system' | 'light' | 'dark';
export type LanguageOption = 'system' | 'en' | 'sv' | 'pt';

export interface UserPreferences {
  countdownDuration: number; // e.g. 3.0 seconds
  darkTheme: DarkThemeOption;
  language: LanguageOption;
  order: OrderType;
  userDefinedOrder: string[];
  soundEffects: boolean;
  haptics: boolean;
}

export interface ActivationLog {
  id: string;
  timestamp: number;
  activityId: string;
  activityLabel: string;
  rewarded: boolean;
  rewardWon?: string;
  reciprocal: number;
}

export const kDefaultReciprocal = 6;
