/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, ActivationLog, UserPreferences, OrderType } from './types/activity';
import { StorageService } from './services/storage';
import { soundEffects } from './services/audio';
import { translations } from './l10n/translations';
import { AppBar } from './components/AppBar';
import { ActivityCard } from './components/ActivityCard';
import { RewardDisplay, DrawOutcome } from './components/RewardDisplay';
import { AddEditActivityModal } from './components/AddEditActivityModal';
import { PreferencesModal } from './components/PreferencesModal';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { Plus, Sparkles } from 'lucide-react';

export default function App() {
  // Load initial data
  const [activities, setActivities] = useState<Activity[]>(() => StorageService.loadActivities());
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.loadPreferences());
  const [history, setHistory] = useState<ActivationLog[]>(() => StorageService.loadHistory());

  // Interactive states
  const [waitingStates, setWaitingStates] = useState<Record<string, boolean>>({});
  const [drawOutcome, setDrawOutcome] = useState<DrawOutcome | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);

  // Sync sound service enabled state
  useEffect(() => {
    soundEffects.setEnabled(preferences.soundEffects);
  }, [preferences.soundEffects]);

  // Determine language: resolve 'system' to navigator language
  const resolvedLang = useMemo<'en' | 'sv' | 'pt'>(() => {
    if (preferences.language !== 'system') {
      return preferences.language;
    }
    const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'pt';
    if (nav.startsWith('pt')) return 'pt';
    if (nav.startsWith('sv')) return 'sv';
    return 'en';
  }, [preferences.language]);

  const t = translations[resolvedLang];

  // Sync Dark Theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      preferences.darkTheme === 'dark' ||
      (preferences.darkTheme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.darkTheme]);

  // Sort activities based on Order
  const sortedActivities = useMemo(() => {
    const list = [...activities];
    switch (preferences.order) {
      case 'createdAsc':
        return list.sort((a, b) => a.createdAt - b.createdAt);
      case 'createdDesc':
        return list.sort((a, b) => b.createdAt - a.createdAt);
      case 'questionAsc':
        return list.sort((a, b) => a.question.localeCompare(b.question));
      case 'questionDesc':
        return list.sort((a, b) => b.question.localeCompare(a.question));
      case 'labelAsc':
        return list.sort((a, b) => {
          const c = a.label.localeCompare(b.label);
          return c !== 0 ? c : a.question.localeCompare(b.question);
        });
      case 'labelDesc':
        return list.sort((a, b) => {
          const c = b.label.localeCompare(a.label);
          return c !== 0 ? c : b.question.localeCompare(a.question);
        });
      case 'userDefined': {
        const orderIds = preferences.userDefinedOrder;
        if (orderIds && orderIds.length > 0) {
          const map = new Map(orderIds.map((id, index) => [id, index]));
          return list.sort((a, b) => {
            const idxA = map.has(a.id) ? map.get(a.id)! : 99999;
            const idxB = map.has(b.id) ? map.get(b.id)! : 99999;
            return idxA - idxB;
          });
        }
        return list;
      }
      case 'random':
        return list;
      default:
        return list;
    }
  }, [activities, preferences.order, preferences.userDefinedOrder]);

  // Save changes to persistence
  const handleUpdateActivities = (newActivities: Activity[]) => {
    setActivities(newActivities);
    StorageService.saveActivities(newActivities);
  };

  const handleUpdatePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    StorageService.savePreferences(newPrefs);
  };

  // Reorder single item up/down
  const handleMoveActivity = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sortedActivities.length) return;
    const items = [...sortedActivities];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);

    const newOrderIds = items.map((a) => a.id);
    const newPrefs: UserPreferences = {
      ...preferences,
      order: 'userDefined',
      userDefinedOrder: newOrderIds,
    };

    handleUpdatePreferences(newPrefs);
    handleUpdateActivities(items);
  };

  // Add / Edit Activity
  const handleSaveActivity = (savedActivity: Activity) => {
    let updated: Activity[];
    const exists = activities.some((a) => a.id === savedActivity.id);
    if (exists) {
      updated = activities.map((a) => (a.id === savedActivity.id ? savedActivity : a));
    } else {
      updated = [...activities, savedActivity];
    }
    handleUpdateActivities(updated);
    setIsAddModalOpen(false);
    setEditingActivity(null);
  };

  // Delete Activity
  const handleDeleteActivity = (activityToDelete: Activity) => {
    const updated = activities.filter((a) => a.id !== activityToDelete.id);
    handleUpdateActivities(updated);
    setIsAddModalOpen(false);
    setEditingActivity(null);
  };

  // Intermittent Reinforcement Activation Engine
  // Fast, responsive, non-blocking execution
  const handleActivate = useCallback(
    (activity: Activity) => {
      soundEffects.playClick();
      if (preferences.haptics) soundEffects.triggerHaptic();

      // Mark activity as waiting during the quick suspense animation
      setWaitingStates((prev) => ({ ...prev, [activity.id]: true }));

      // Fast duration: 500ms max so the app never feels slow
      const durationMs = 500;

      setTimeout(() => {
        // Probabilistic reward test: 1 / reciprocal
        const odds = 1 / Math.max(1, activity.reciprocal);
        const won = activity.rewards.length > 0 && Math.random() < odds;

        let rewardItem = '';
        if (won && activity.rewards.length > 0) {
          const randomIndex = Math.floor(Math.random() * activity.rewards.length);
          rewardItem = activity.rewards[randomIndex];
          soundEffects.playRewardFanfare();
        } else {
          soundEffects.playNoReward();
        }

        // Log to history
        const log: ActivationLog = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          activityId: activity.id,
          activityLabel: activity.label,
          rewarded: won,
          rewardWon: rewardItem || undefined,
          reciprocal: activity.reciprocal,
        };
        StorageService.addHistoryLog(log);
        setHistory((prev) => [log, ...prev].slice(0, 100));

        // Display clear result immediately!
        setDrawOutcome({
          activity,
          won,
          reward: rewardItem,
        });

        // Re-enable button
        setWaitingStates((prev) => ({ ...prev, [activity.id]: false }));
      }, durationMs);
    },
    [preferences.haptics]
  );

  return (
    <div className="min-h-screen bg-[#F6F3DF] dark:bg-[#191813] text-neutral-900 dark:text-[#F6F3DF] transition-colors selection:bg-[#B69B00]/30 selection:text-neutral-900 flex flex-col">
      {/* Material 3 App Bar */}
      <AppBar
        currentLang={resolvedLang}
        currentOrder={preferences.order}
        darkTheme={preferences.darkTheme}
        soundEnabled={preferences.soundEffects}
        onSetOrder={(order: OrderType) => {
          handleUpdatePreferences({ ...preferences, order });
        }}
        onToggleTheme={() => {
          const next = preferences.darkTheme === 'dark' ? 'light' : 'dark';
          handleUpdatePreferences({ ...preferences, darkTheme: next });
        }}
        onToggleSound={() => {
          handleUpdatePreferences({
            ...preferences,
            soundEffects: !preferences.soundEffects,
          });
        }}
        onOpenAddModal={() => {
          setEditingActivity(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsPreferencesOpen(true)}
        onOpenAboutModal={() => setIsAboutOpen(true)}
        onOpenHistoryModal={() => setIsHistoryOpen(true)}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Concept Card (Clean, no Flutter code option) */}
        <div className="rounded-3xl bg-white/70 dark:bg-[#25231B]/70 border border-[#B69B00]/20 dark:border-[#B69B00]/30 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B69B00] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema de Reforço Intermitente</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-[#F6F3DF]">
              Complete seus Hábitos · Sorteie Recompensas
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
              Baseado na psicologia comportamental: recompensas probabilísticas mantêm o cérebro motivado e constroem disciplina duradoura.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingActivity(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#B69B00] hover:bg-[#9E8600] active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addActivity}</span>
          </button>
        </div>

        {/* Activities List */}
        {sortedActivities.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#B69B00]/30 p-8 bg-white/40 dark:bg-[#25231B]/40">
            <div className="w-16 h-16 rounded-full bg-[#B69B00]/15 text-[#B69B00] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-[#F6F3DF]">
              {t.noActivitiesTitle}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {t.noActivitiesSubtitle}
            </p>
            <button
              onClick={() => {
                soundEffects.playClick();
                setEditingActivity(null);
                setIsAddModalOpen(true);
              }}
              className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addFirstActivity}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {t.activities} ({sortedActivities.length})
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {t.order}: {preferences.order}
              </span>
            </div>

            {sortedActivities.map((act, index) => (
              <ActivityCard
                key={act.id}
                activity={act}
                index={index}
                totalCount={sortedActivities.length}
                isWaiting={waitingStates[act.id] || false}
                activateText={t.activate}
                activatingText={t.activating}
                onActivate={handleActivate}
                onEdit={(item) => {
                  setEditingActivity(item);
                  setIsAddModalOpen(true);
                }}
                onMoveUp={(idx) => handleMoveActivity(idx, idx - 1)}
                onMoveDown={(idx) => handleMoveActivity(idx, idx + 1)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Immediate Clear Draw Outcome Dialog (Reward or Friendly No-Reward Result) */}
      <RewardDisplay
        outcome={drawOutcome}
        onDismiss={() => setDrawOutcome(null)}
        onRetry={(act) => handleActivate(act)}
        currentLang={resolvedLang}
      />

      {/* Add / Edit Activity Modal */}
      <AddEditActivityModal
        activity={editingActivity}
        isOpen={isAddModalOpen}
        currentLang={resolvedLang}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        preferences={preferences}
        currentLang={resolvedLang}
        onClose={() => setIsPreferencesOpen(false)}
        onUpdatePreferences={handleUpdatePreferences}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        currentLang={resolvedLang}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        currentLang={resolvedLang}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={() => {
          StorageService.clearHistory();
          setHistory([]);
        }}
      />

      {/* APK Guide Modal */}
      <ApkGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />

      {/* Bottom footer */}
      <footer className="mt-auto border-t border-[#B69B00]/15 dark:border-[#B69B00]/25 py-4 px-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p>Reward Randomizer · Sistema de Reforço Intermitente para Hábitos</p>
      </footer>
    </div>
  );
}
