import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ArrowUpDown,
  Settings,
  Info,
  History,
  Smartphone,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { OrderType, DarkThemeOption, LanguageOption } from '../types/activity';
import { translations } from '../l10n/translations';
import { soundEffects } from '../services/audio';

interface AppBarProps {
  currentLang: 'en' | 'sv' | 'pt';
  currentOrder: OrderType;
  darkTheme: DarkThemeOption;
  soundEnabled: boolean;
  onSetOrder: (order: OrderType) => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAboutModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenApkGuide: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  currentLang,
  currentOrder,
  darkTheme,
  soundEnabled,
  onSetOrder,
  onToggleTheme,
  onToggleSound,
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenAboutModal,
  onOpenHistoryModal,
  onOpenApkGuide,
}) => {
  const t = translations[currentLang];
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const orderMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orderMenuRef.current && !orderMenuRef.current.contains(event.target as Node)) {
        setOrderMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const orderOptions: { type: OrderType; label: string }[] = [
    { type: 'createdAsc', label: t.orderCreatedAsc },
    { type: 'createdDesc', label: t.orderCreatedDesc },
    { type: 'questionAsc', label: t.orderQuestionAsc },
    { type: 'questionDesc', label: t.orderQuestionDesc },
    { type: 'labelAsc', label: t.orderLabelAsc },
    { type: 'labelDesc', label: t.orderLabelDesc },
    { type: 'userDefined', label: t.orderUserDefined },
    { type: 'random', label: t.orderRandom },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#F6F3DF]/95 dark:bg-[#191813]/95 backdrop-blur-md border-b border-[#B69B00]/20 dark:border-[#B69B00]/30 transition-colors">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#B69B00] text-white flex items-center justify-center shadow-sm">
          <span className="font-bold text-lg font-mono">RR</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-[#F6F3DF] leading-tight">
            {t.appTitle}
          </h1>
          <p className="text-xs text-[#726100] dark:text-[#B69B00]/90 font-medium">
            Intermittent Reinforcement
          </p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Sound toggle */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15 rounded-full transition-colors"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-[#B69B00]" /> : <VolumeX className="w-5 h-5 opacity-60" />}
        </button>

        {/* Theme quick toggle */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onToggleTheme();
          }}
          title="Toggle Light / Dark"
          className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15 rounded-full transition-colors"
          aria-label="Toggle Theme"
        >
          {darkTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#726100]" />}
        </button>

        {/* Order Menu Dropdown */}
        <div className="relative" ref={orderMenuRef}>
          <button
            onClick={() => {
              soundEffects.playClick();
              setOrderMenuOpen(!orderMenuOpen);
            }}
            title={t.order}
            className={`p-2 rounded-full transition-colors ${
              orderMenuOpen ? 'bg-[#B69B00]/25 text-[#B69B00]' : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15'
            }`}
            aria-label={t.order}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>

          {orderMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#2A2820] shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {t.order}
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {orderOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      soundEffects.playClick();
                      onSetOrder(opt.type);
                      setOrderMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-colors ${
                      currentOrder === opt.type
                        ? 'bg-[#B69B00]/15 text-[#B69B00] dark:text-[#B69B00] font-semibold'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {currentOrder === opt.type && (
                      <span className="w-2 h-2 rounded-full bg-[#B69B00]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenHistoryModal();
          }}
          title={t.history}
          className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15 rounded-full transition-colors"
          aria-label={t.history}
        >
          <History className="w-5 h-5" />
        </button>

        {/* Add Activity Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenAddModal();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-full shadow-sm hover:shadow active:scale-95 transition-all"
          aria-label={t.addActivity}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">{t.addActivity}</span>
        </button>

        {/* More Options Menu */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => {
              soundEffects.playClick();
              setMoreMenuOpen(!moreMenuOpen);
            }}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15 rounded-full transition-colors"
            aria-label="More options"
          >
            <Settings className="w-5 h-5" />
          </button>

          {moreMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#2A2820] shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenSettingsModal();
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center gap-2.5"
              >
                <Settings className="w-4 h-4 text-[#B69B00]" />
                <span>{t.settings}</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenApkGuide();
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center gap-2.5"
              >
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Gerar APK (Android)</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenAboutModal();
                  setMoreMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center gap-2.5"
              >
                <Info className="w-4 h-4 text-[#B69B00]" />
                <span>{t.about}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
