import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, X, Sparkles, Dices, RefreshCw } from 'lucide-react';
import { Activity } from '../types/activity';
import { soundEffects } from '../services/audio';

export interface DrawOutcome {
  activity: Activity;
  won: boolean;
  reward?: string;
}

interface RewardDisplayProps {
  outcome: DrawOutcome | null;
  onDismiss: () => void;
  onRetry: (activity: Activity) => void;
  currentLang: 'en' | 'sv' | 'pt';
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({
  outcome,
  onDismiss,
  onRetry,
  currentLang,
}) => {
  useEffect(() => {
    if (!outcome) return;

    if (outcome.won) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B69B00', '#F6F3DF', '#E8D04B', '#FFD700', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  }, [outcome]);

  if (!outcome) {
    return null;
  }

  const { activity, won, reward } = outcome;
  const pct = (100 / Math.max(1, activity.reciprocal)).toFixed(1);

  // Localization snippets
  const isPt = currentLang === 'pt';
  const isSv = currentLang === 'sv';

  const congratsTitle = isPt
    ? 'Recompensa Desbloqueada!'
    : isSv
    ? 'Belöning Upplåst!'
    : 'Reward Unlocked!';

  const noRewardTitle = isPt
    ? 'Nenhuma recompensa desta vez'
    : isSv
    ? 'Ingen belöning den här gången'
    : 'No reward this time';

  const noRewardBody = isPt
    ? `Você completou o hábito! A probabilidade sorteada foi de 1 em ${activity.reciprocal} (${pct}%). Continue firme — a imprevisibilidade é a chave do reforço intermitente!`
    : isSv
    ? `Du slutförde vanan! Oddsen var 1 på ${activity.reciprocal} (${pct}%). Fortsätt så — oförutsägbarheten bygger vanor!`
    : `You completed the habit! The odds were 1 in ${activity.reciprocal} (${pct}%). Keep it up — unpredictability is the core of intermittent reinforcement!`;

  const claimLabel = isPt ? 'Resgatar Recompensa' : isSv ? 'Ta emot belöning' : 'Claim Reward';
  const tryAgainLabel = isPt ? 'Sortear Novamente' : isSv ? 'Slå igen' : 'Roll Again';
  const closeLabel = isPt ? 'Fechar' : isSv ? 'Stäng' : 'Close';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
      style={{
        background: won
          ? 'radial-gradient(circle at center, rgba(182, 155, 0, 0.45) 0%, rgba(25, 24, 19, 0.94) 80%)'
          : 'radial-gradient(circle at center, rgba(100, 100, 100, 0.25) 0%, rgba(20, 20, 18, 0.92) 80%)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onDismiss}
    >
      <div
        className="relative max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#25231B] border border-[#B69B00]/40 shadow-2xl text-center overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onDismiss();
          }}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {won ? (
          // ==================== WIN STATE ====================
          <div className="space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#B69B00]/20 text-[#B69B00] flex items-center justify-center mx-auto shadow-inner ring-8 ring-[#B69B00]/15 animate-bounce">
              <Gift className="w-10 h-10" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest text-[#B69B00] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{congratsTitle}</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <p className="text-xs text-neutral-500 font-medium">
              {activity.label} · 1 in {activity.reciprocal} ({pct}%)
            </p>

            {/* AutoSize typography font size 64 */}
            <div className="py-2 px-3 rounded-2xl bg-[#B69B00]/10 border border-[#B69B00]/20">
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-[#F6F3DF] tracking-tight leading-tight select-all drop-shadow-xs"
                style={{ textWrap: 'balance', wordBreak: 'break-word' }}
              >
                {reward}
              </h2>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onDismiss();
                }}
                className="w-full sm:w-auto min-w-[200px] px-6 py-3 text-sm font-bold text-white bg-[#B69B00] hover:bg-[#9E8600] active:scale-95 rounded-xl shadow-md shadow-[#B69B00]/20 transition-all"
              >
                {claimLabel}
              </button>
            </div>
          </div>
        ) : (
          // ==================== NO REWARD THIS TIME ====================
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto shadow-inner">
              <Dices className="w-8 h-8 text-[#B69B00]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-[#F6F3DF]">
              {noRewardTitle}
            </h3>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {noRewardBody}
            </p>

            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-800 text-left text-xs space-y-1">
              <div className="flex justify-between text-neutral-500">
                <span>{activity.label}</span>
                <span className="font-mono">Odds: 1/{activity.reciprocal} ({pct}%)</span>
              </div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                "{activity.question}"
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onRetry(activity);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B69B00]" />
                <span>{tryAgainLabel}</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  onDismiss();
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-xl transition-colors"
              >
                {closeLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
