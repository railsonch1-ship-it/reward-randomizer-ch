import React from 'react';
import {
  GlassWater,
  Dumbbell,
  Apple,
  Bed,
  Activity as HeartPulse,
  Flame,
  Sparkles,
  Laptop,
  Briefcase,
  CheckCheck,
  CalendarCheck,
  Clock,
  PenTool,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Languages,
  Brain,
  Newspaper,
  Coffee,
  Music,
  Gamepad2,
  Paintbrush,
  Disc3,
  Sprout,
  Camera,
  Bike,
  Footprints,
  Mountain,
  Medal,
  ShieldAlert,
  Dices,
  Star,
  HelpCircle,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const props = { className, size };

  switch (name) {
    case 'glass-water':
      return <GlassWater {...props} />;
    case 'dumbbell':
      return <Dumbbell {...props} />;
    case 'apple-whole':
      return <Apple {...props} />;
    case 'bed':
      return <Bed {...props} />;
    case 'heart-pulse':
      return <HeartPulse {...props} />;
    case 'person-running':
      return <Flame {...props} />;
    case 'spa':
      return <Sparkles {...props} />;
    case 'laptop-code':
      return <Laptop {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'check-double':
      return <CheckCheck {...props} />;
    case 'calendar-check':
      return <CalendarCheck {...props} />;
    case 'clock':
      return <Clock {...props} />;
    case 'pen-nib':
      return <PenTool {...props} />;
    case 'lightbulb':
      return <Lightbulb {...props} />;
    case 'book-open':
      return <BookOpen {...props} />;
    case 'graduation-cap':
      return <GraduationCap {...props} />;
    case 'language':
      return <Languages {...props} />;
    case 'brain':
      return <Brain {...props} />;
    case 'newspaper':
      return <Newspaper {...props} />;
    case 'mug-hot':
      return <Coffee {...props} />;
    case 'music':
      return <Music {...props} />;
    case 'gamepad':
      return <Gamepad2 {...props} />;
    case 'paint-brush':
      return <Paintbrush {...props} />;
    case 'guitar':
      return <Disc3 {...props} />;
    case 'seedling':
      return <Sprout {...props} />;
    case 'camera':
      return <Camera {...props} />;
    case 'bicycle':
      return <Bike {...props} />;
    case 'shoe-prints':
      return <Footprints {...props} />;
    case 'mountain':
      return <Mountain {...props} />;
    case 'medal':
      return <Medal {...props} />;
    case 'basketball':
      return <Dices {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'fire':
      return <Flame {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'shield-halved':
      return <ShieldAlert {...props} />;
    case 'dice':
      return <Dices {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
