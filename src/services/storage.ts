import { Activity, ActivationLog, UserPreferences, kDefaultReciprocal } from '../types/activity';

const ACTIVITIES_STORAGE_KEY = 'reward_randomizer_activities';
const PREFERENCES_STORAGE_KEY = 'reward_randomizer_preferences';
const HISTORY_STORAGE_KEY = 'reward_randomizer_history';

export const defaultPreferences: UserPreferences = {
  countdownDuration: 0.8,
  darkTheme: 'system',
  language: 'system',
  order: 'createdAsc',
  userDefinedOrder: [],
  soundEffects: true,
  haptics: true,
};

export const defaultSeedActivities: Activity[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    iconName: 'glass-water',
    iconCodePoint: 0xf556,
    iconFontFamily: 'FontAwesomeSolid',
    iconFontPackage: 'font_awesome_flutter',
    label: 'Hydration',
    question: 'Did you drink a tall glass of water?',
    answer: 'Yes',
    reciprocal: 6,
    rewards: [
      'Take a 10-minute walk outside',
      'Enjoy a delicious iced tea or coffee',
      'Listen to 2 favorite songs with eyes closed',
      '5 minutes stretching break'
    ],
    createdAt: Date.now() - 400000000,
  },
  {
    id: '7b26c615-1888-469b-bfcf-22e6b6bb5c24',
    iconName: 'book-open',
    iconCodePoint: 0xf518,
    iconFontFamily: 'FontAwesomeSolid',
    iconFontPackage: 'font_awesome_flutter',
    label: 'Reading',
    question: 'Did you read 10 pages of a good book?',
    answer: 'Yes',
    reciprocal: 5,
    rewards: [
      'Watch one YouTube video guilt-free',
      'Eat a square of dark chocolate',
      'Play 15 minutes of video games',
      'Check your favorite forum or feed for 10m'
    ],
    createdAt: Date.now() - 300000000,
  },
  {
    id: '9c5e3d74-a1e6-42d8-990a-e8d121bc3410',
    iconName: 'dumbbell',
    iconCodePoint: 0xf44b,
    iconFontFamily: 'FontAwesomeSolid',
    iconFontPackage: 'font_awesome_flutter',
    label: 'Workout',
    question: 'Did you complete your daily exercise or stretch?',
    answer: 'Yes',
    reciprocal: 4,
    rewards: [
      'Order or make your dream protein smoothie',
      'Watch an episode of your favorite series',
      'Take a relaxing warm shower or bath',
      'Buy a small personal treat on the weekend'
    ],
    createdAt: Date.now() - 200000000,
  },
  {
    id: 'e12b7a99-4d62-4f38-8921-6501fa382901',
    iconName: 'laptop-code',
    iconCodePoint: 0xf5fc,
    iconFontFamily: 'FontAwesomeSolid',
    iconFontPackage: 'font_awesome_flutter',
    label: 'Deep Focus',
    question: 'Did you complete a 25-minute Pomodoro focus block?',
    answer: 'Yes',
    reciprocal: 6,
    rewards: [
      '15 minutes of uninterrupted fun gaming',
      'Browse cool tech gadgets for 10m',
      'Enjoy an espresso or warm matcha',
      'Call or message a close friend'
    ],
    createdAt: Date.now() - 100000000,
  }
];

export class StorageService {
  // Load activities
  static loadActivities(): Activity[] {
    try {
      const data = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(defaultSeedActivities));
        return defaultSeedActivities;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return defaultSeedActivities;
    } catch {
      return defaultSeedActivities;
    }
  }

  // Save activities
  static saveActivities(activities: Activity[]): void {
    try {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
    } catch {
      // storage error
    }
  }

  // Load preferences
  static loadPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!data) return defaultPreferences;
      return { ...defaultPreferences, ...JSON.parse(data) };
    } catch {
      return defaultPreferences;
    }
  }

  // Save preferences
  static savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage error
    }
  }

  // Load activation history
  static loadHistory(): ActivationLog[] {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Add activation log
  static addHistoryLog(log: ActivationLog): void {
    try {
      const current = this.loadHistory();
      const updated = [log, ...current].slice(0, 100); // keep recent 100
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage error
    }
  }

  // Clear history
  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // storage error
    }
  }
}
