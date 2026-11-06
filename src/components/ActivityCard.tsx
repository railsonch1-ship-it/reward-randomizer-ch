import React from 'react';
import { Activity } from '../types/activity';
import { DynamicIcon } from './DynamicIcon';
import { ChevronUp, ChevronDown, Edit3 } from 'lucide-react';
import { soundEffects } from '../services/audio';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  totalCount: number;
  isWaiting: boolean;
  activateText: string;
  activatingText: string;
  onActivate: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  index,
  totalCount,
  isWaiting,
  activateText,
  activatingText,
  onActivate,
  onEdit,
  onMoveUp,
  onMoveDown,
}) => {
  const percentage = (100 / Math.max(1, activity.reciprocal)).toFixed(1);

  return (
    <div className="group relative rounded-2xl bg-white/90 dark:bg-[#25231B] border border-[#B69B00]/20 dark:border-[#B69B00]/30 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon and Details */}
        <div
          className="flex items-start sm:items-center gap-3.5 flex-1 cursor-pointer"
          onClick={() => {
            soundEffects.playClick();
            onEdit(activity);
          }}
          title="Click to edit activity"
        >
          {/* Avatar Icon */}
          <div className="w-12 h-12 rounded-full bg-[#B69B00]/15 text-[#B69B00] dark:bg-[#B69B00]/25 dark:text-[#E8D04B] flex items-center justify-center shrink-0 shadow-inner">
            <DynamicIcon name={activity.iconName} className="w-6 h-6" />
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-[#F6F3DF] leading-snug line-clamp-2">
                {activity.question}
              </h3>
              <Edit3 className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:inline" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs italic font-medium text-[#B69B00] dark:text-[#D4B924]">
                {activity.label}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                1 in {activity.reciprocal} ({percentage}%)
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {activity.rewards.length} {activity.rewards.length === 1 ? 'reward' : 'rewards'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
          {/* Reorder Buttons */}
          <div className="flex items-center gap-0.5 text-neutral-400">
            {onMoveUp && (
              <button
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  soundEffects.playClick();
                  onMoveUp(index);
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Move up"
                aria-label="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button
                disabled={index === totalCount - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  soundEffects.playClick();
                  onMoveDown(index);
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Move down"
                aria-label="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Edit Habit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              onEdit(activity);
            }}
            title="Editar este hábito"
            className="h-10 px-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-[#B69B00]/15 hover:text-[#B69B00] dark:hover:bg-[#B69B00]/25 dark:hover:text-[#E8D04B] border border-neutral-200/80 dark:border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          {/* Activate Button */}
          <button
            disabled={isWaiting}
            onClick={() => onActivate(activity)}
            className={`min-w-[108px] h-10 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
              isWaiting
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-[#B69B00] hover:bg-[#9E8600] active:scale-95 text-white shadow-[#B69B00]/20 hover:shadow-md'
            }`}
          >
            {isWaiting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-[#B69B00]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="normal-case">{activatingText}</span>
              </>
            ) : (
              <span>{activateText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
