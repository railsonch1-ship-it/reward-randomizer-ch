export interface AppIconInfo {
  name: string;
  label: string;
  codePoint: number;
  category: 'health' | 'productivity' | 'learning' | 'lifestyle' | 'sports' | 'general';
}

export const AVAILABLE_ICONS: AppIconInfo[] = [
  // Health & Body
  { name: 'glass-water', label: 'Water Glass', codePoint: 0xf556, category: 'health' },
  { name: 'dumbbell', label: 'Dumbbell', codePoint: 0xf44b, category: 'health' },
  { name: 'apple-whole', label: 'Healthy Apple', codePoint: 0xf5d1, category: 'health' },
  { name: 'bed', label: 'Sleep & Rest', codePoint: 0xf236, category: 'health' },
  { name: 'heart-pulse', label: 'Heart Pulse', codePoint: 0xf21e, category: 'health' },
  { name: 'person-running', label: 'Running', codePoint: 0xf70c, category: 'health' },
  { name: 'spa', label: 'Meditation & Spa', codePoint: 0xf5bb, category: 'health' },

  // Productivity & Work
  { name: 'laptop-code', label: 'Coding & Tech', codePoint: 0xf5fc, category: 'productivity' },
  { name: 'briefcase', label: 'Work & Career', codePoint: 0xf0b1, category: 'productivity' },
  { name: 'check-double', label: 'Completed Tasks', codePoint: 0xf560, category: 'productivity' },
  { name: 'calendar-check', label: 'Schedule & Calendar', codePoint: 0xf274, category: 'productivity' },
  { name: 'clock', label: 'Time Management', codePoint: 0xf017, category: 'productivity' },
  { name: 'pen-nib', label: 'Writing & Journaling', codePoint: 0xf5ad, category: 'productivity' },
  { name: 'lightbulb', label: 'Ideation', codePoint: 0xf0eb, category: 'productivity' },

  // Learning & Mind
  { name: 'book-open', label: 'Book & Reading', codePoint: 0xf518, category: 'learning' },
  { name: 'graduation-cap', label: 'Study & Academics', codePoint: 0xf19d, category: 'learning' },
  { name: 'language', label: 'Language Learning', codePoint: 0xf1ab, category: 'learning' },
  { name: 'brain', label: 'Mental Fitness', codePoint: 0xf5dc, category: 'learning' },
  { name: 'newspaper', label: 'News & Articles', codePoint: 0xf1ea, category: 'learning' },

  // Lifestyle & Leisure
  { name: 'mug-hot', label: 'Coffee & Tea', codePoint: 0xf7b6, category: 'lifestyle' },
  { name: 'music', label: 'Music & Instrument', codePoint: 0xf001, category: 'lifestyle' },
  { name: 'gamepad', label: 'Gaming', codePoint: 0xf11b, category: 'lifestyle' },
  { name: 'paint-brush', label: 'Art & Painting', codePoint: 0xf1fc, category: 'lifestyle' },
  { name: 'guitar', label: 'Guitar', codePoint: 0xf7a6, category: 'lifestyle' },
  { name: 'seedling', label: 'Gardening & Plants', codePoint: 0xf4d8, category: 'lifestyle' },
  { name: 'camera', label: 'Photography', codePoint: 0xf030, category: 'lifestyle' },

  // Sports & Outdoors
  { name: 'bicycle', label: 'Cycling', codePoint: 0xf206, category: 'sports' },
  { name: 'shoe-prints', label: 'Walking Steps', codePoint: 0xf54b, category: 'sports' },
  { name: 'mountain', label: 'Hiking & Adventure', codePoint: 0xf6fc, category: 'sports' },
  { name: 'medal', label: 'Achievement & Trophy', codePoint: 0xf5a2, category: 'sports' },
  { name: 'basketball', label: 'Basketball', codePoint: 0xf434, category: 'sports' },

  // General & Habits
  { name: 'star', label: 'Favorite Star', codePoint: 0xf005, category: 'general' },
  { name: 'fire', label: 'Streak & Passion', codePoint: 0xf06d, category: 'general' },
  { name: 'sparkles', label: 'Clean & Tidy', codePoint: 0xe004, category: 'general' },
  { name: 'shield-halved', label: 'Self Discipline', codePoint: 0xf3ed, category: 'general' },
  { name: 'dice', label: 'Odds & Random', codePoint: 0xf522, category: 'general' }
];

export function getIconInfo(iconName?: string): AppIconInfo {
  const match = AVAILABLE_ICONS.find(i => i.name === iconName);
  return match || AVAILABLE_ICONS[0];
}
