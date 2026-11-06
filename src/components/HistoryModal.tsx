import React from 'react';
import { ActivationLog } from '../types/activity';
import { X, Trophy, MinusCircle, Trash2, TrendingUp } from 'lucide-react';
import { translations } from '../l10n/translations';
import { soundEffects } from '../services/audio';

interface HistoryModalProps {
  isOpen: boolean;
  history: ActivationLog[];
  currentLang: 'en' | 'sv' | 'pt';
  onClose: () => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  currentLang,
  onClose,
  onClearHistory,
}) => {
  const t = translations[currentLang];

  if (!isOpen) return null;

  const totalActivations = history.length;
  const rewardsCount = history.filter((h) => h.rewarded).length;
  const strikeRate =
    totalActivations > 0 ? ((rewardsCount / totalActivations) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#25231B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-[#F6F3DF]">
            {t.historyTitle}
          </h2>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-neutral-50 dark:bg-[#1E1C16] border-b border-neutral-100 dark:border-neutral-800">
          <div className="p-3 bg-white dark:bg-[#25231B] rounded-2xl border border-neutral-200/60 dark:border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              {t.totalActivations}
            </span>
            <span className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              {totalActivations}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#25231B] rounded-2xl border border-neutral-200/60 dark:border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Rewards Won
            </span>
            <span className="text-xl font-bold font-mono text-[#B69B00] tabular-nums">
              {rewardsCount}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#25231B] rounded-2xl border border-neutral-200/60 dark:border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              {t.rewardRate}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {strikeRate}%
            </span>
          </div>
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">{t.historyEmpty}</p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200/70 dark:border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.rewarded
                          ? 'bg-[#B69B00]/20 text-[#B69B00]'
                          : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {item.rewarded ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <MinusCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {item.activityLabel}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          (1 in {item.reciprocal})
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {item.rewarded ? (
                          <span className="text-[#B69B00] dark:text-[#E8D04B] font-medium">
                            Unlocked: {item.rewardWon}
                          </span>
                        ) : (
                          'No reward (variable ratio test)'
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                    {dateStr}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#1E1C16]/50 flex items-center justify-between">
          {history.length > 0 ? (
            <button
              onClick={() => {
                soundEffects.playClick();
                onClearHistory();
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
