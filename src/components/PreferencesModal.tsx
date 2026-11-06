import React from 'react';
import { UserPreferences, DarkThemeOption, LanguageOption } from '../types/activity';
import { X, Moon, Globe, Clock, Volume2, Smartphone } from 'lucide-react';
import { translations } from '../l10n/translations';
import { soundEffects } from '../services/audio';

interface PreferencesModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  currentLang: 'en' | 'sv' | 'pt';
  onClose: () => void;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  preferences,
  currentLang,
  onClose,
  onUpdatePreferences,
}) => {
  const t = translations[currentLang];

  if (!isOpen) return null;

  const handleChangeCountdown = (val: number) => {
    onUpdatePreferences({ ...preferences, countdownDuration: val });
  };

  const handleChangeTheme = (theme: DarkThemeOption) => {
    soundEffects.playClick();
    onUpdatePreferences({ ...preferences, darkTheme: theme });
  };

  const handleChangeLanguage = (lang: LanguageOption) => {
    soundEffects.playClick();
    onUpdatePreferences({ ...preferences, language: lang });
  };

  const handleToggleSound = () => {
    const newVal = !preferences.soundEffects;
    soundEffects.setEnabled(newVal);
    if (newVal) soundEffects.playClick();
    onUpdatePreferences({ ...preferences, soundEffects: newVal });
  };

  const handleToggleHaptics = () => {
    soundEffects.playClick();
    if (!preferences.haptics) soundEffects.triggerHaptic();
    onUpdatePreferences({ ...preferences, haptics: !preferences.haptics });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#25231B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-[#F6F3DF]">
            {t.settings}
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

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
          {/* Countdown Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B69B00]" />
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {t.countdownDuration}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#B69B00] tabular-nums">
                {preferences.countdownDuration.toFixed(1)} {t.seconds}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={preferences.countdownDuration}
              onChange={(e) => handleChangeCountdown(parseFloat(e.target.value))}
              className="w-full accent-[#B69B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>1.0s</span>
              <span>5.0s</span>
              <span>10.0s</span>
            </div>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          {/* Theme Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-[#B69B00]" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {t.theme}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['system', 'light', 'dark'] as DarkThemeOption[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleChangeTheme(mode)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    preferences.darkTheme === mode
                      ? 'bg-[#B69B00] text-white border-[#B69B00] shadow-sm font-semibold'
                      : 'bg-neutral-50 dark:bg-[#1E1C16] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-[#B69B00]/50'
                  }`}
                >
                  {mode === 'system' && t.themeSystem}
                  {mode === 'light' && t.themeLight}
                  {mode === 'dark' && t.themeDark}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          {/* Language Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#B69B00]" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {t.language}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'system', name: 'System Default' },
                { id: 'en', name: 'English' },
                { id: 'sv', name: 'Svenska' },
                { id: 'pt', name: 'Português' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChangeLanguage(item.id as LanguageOption)}
                  className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                    preferences.language === item.id
                      ? 'bg-[#B69B00]/15 border-[#B69B00] text-[#B69B00] font-semibold'
                      : 'bg-neutral-50 dark:bg-[#1E1C16] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-[#B69B00]/50'
                  }`}
                >
                  <span>{item.name}</span>
                  {preferences.language === item.id && (
                    <span className="w-2 h-2 rounded-full bg-[#B69B00]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          {/* Sound & Haptics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#B69B00]" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {t.soundEffects}
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.soundEffects}
                onChange={handleToggleSound}
                className="w-4 h-4 accent-[#B69B00] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#B69B00]" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {t.hapticFeedback}
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.haptics}
                onChange={handleToggleHaptics}
                className="w-4 h-4 accent-[#B69B00] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#1E1C16]/50 flex justify-end">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
