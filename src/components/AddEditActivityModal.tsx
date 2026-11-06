import React, { useState, useEffect } from 'react';
import { Activity } from '../types/activity';
import { AVAILABLE_ICONS, getIconInfo } from '../data/iconsCatalog';
import { DynamicIcon } from './DynamicIcon';
import { X, Plus, Trash2, Search, AlertCircle } from 'lucide-react';
import { translations } from '../l10n/translations';
import { soundEffects } from '../services/audio';

interface AddEditActivityModalProps {
  activity: Activity | null; // null if creating new
  isOpen: boolean;
  currentLang: 'en' | 'sv' | 'pt';
  onClose: () => void;
  onSave: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export const AddEditActivityModal: React.FC<AddEditActivityModalProps> = ({
  activity,
  isOpen,
  currentLang,
  onClose,
  onSave,
  onDelete,
}) => {
  const t = translations[currentLang];

  const [question, setQuestion] = useState(activity?.question || '');
  const [label, setLabel] = useState(activity?.label || '');
  const [answer, setAnswer] = useState(activity?.answer || 'Yes');
  const [reciprocal, setReciprocal] = useState(activity?.reciprocal || 6);
  const [selectedIconName, setSelectedIconName] = useState(activity?.iconName || 'glass-water');
  const [rewards, setRewards] = useState<string[]>(
    activity?.rewards && activity.rewards.length > 0 ? [...activity.rewards] : []
  );
  const [newRewardInput, setNewRewardInput] = useState('');

  // Icon picker state
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Delete confirm state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize state when editing a habit or opening modal
  useEffect(() => {
    if (isOpen) {
      setQuestion(activity?.question || '');
      setLabel(activity?.label || '');
      setAnswer(activity?.answer || 'Yes');
      setReciprocal(activity?.reciprocal || 6);
      setSelectedIconName(activity?.iconName || 'glass-water');
      setRewards(
        activity?.rewards && activity.rewards.length > 0 ? [...activity.rewards] : []
      );
      setNewRewardInput('');
      setIconPickerOpen(false);
      setShowDeleteConfirm(false);
      setErrorMsg('');
    }
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!activity;

  // Reciprocal calculation
  const probabilityPct = (100 / Math.max(1, reciprocal)).toFixed(1);
  const probabilityLabel = t.probabilityText(reciprocal, probabilityPct);

  // Icon filtering
  const filteredIcons = AVAILABLE_ICONS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(iconSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddReward = () => {
    const trimmed = newRewardInput.trim();
    if (trimmed) {
      soundEffects.playClick();
      setRewards((prev) => [...prev, trimmed]);
      setNewRewardInput('');
    }
  };

  const handleRemoveReward = (index: number) => {
    soundEffects.playClick();
    setRewards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUseDefaultRewards = () => {
    soundEffects.playClick();
    setRewards([...t.defaultRewards]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setErrorMsg('Question is required');
      return;
    }
    if (!label.trim()) {
      setErrorMsg('Label is required');
      return;
    }

    const iconInfo = getIconInfo(selectedIconName);
    const finalRewards = rewards.length > 0 ? rewards : [...t.defaultRewards];

    const savedActivity: Activity = {
      id: activity?.id || crypto.randomUUID(),
      iconName: selectedIconName,
      iconCodePoint: iconInfo.codePoint,
      iconFontFamily: 'FontAwesomeSolid',
      iconFontPackage: 'font_awesome_flutter',
      label: label.trim(),
      question: question.trim(),
      answer: answer.trim() || 'Yes',
      reciprocal: Math.max(1, reciprocal),
      rewards: finalRewards,
      createdAt: activity?.createdAt || Date.now(),
    };

    soundEffects.playClick();
    onSave(savedActivity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-[#25231B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-[#F6F3DF]">
            {isEditing ? t.editActivity : t.addActivity}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Icon Selector Button */}
          <div className="flex flex-col items-center justify-center pt-1 pb-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIconPickerOpen(!iconPickerOpen);
              }}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="w-16 h-16 rounded-full bg-[#B69B00]/15 dark:bg-[#B69B00]/25 text-[#B69B00] dark:text-[#E8D04B] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ring-4 ring-transparent group-hover:ring-[#B69B00]/20">
                <DynamicIcon name={selectedIconName} className="w-8 h-8" />
              </div>
              <span className="mt-2 text-xs font-semibold text-[#B69B00] hover:underline">
                {t.selectIcon}
              </span>
            </button>

            {/* Icon Picker Accordion */}
            {iconPickerOpen && (
              <div className="mt-4 w-full p-4 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-800">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder={t.searchIcons}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#25231B] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B69B00]"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['all', 'health', 'productivity', 'learning', 'lifestyle', 'sports', 'general'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                          selectedCategory === cat
                            ? 'bg-[#B69B00] text-white'
                            : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {cat === 'all' ? t.allCategories : cat}
                      </button>
                    )
                  )}
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-1">
                  {filteredIcons.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedIconName(item.name);
                        setIconPickerOpen(false);
                      }}
                      title={item.label}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                        selectedIconName === item.name
                          ? 'bg-[#B69B00] text-white shadow-sm scale-110'
                          : 'bg-white dark:bg-[#25231B] text-neutral-700 dark:text-neutral-300 hover:bg-[#B69B00]/15'
                      }`}
                    >
                      <DynamicIcon name={item.name} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question Field */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {t.questionLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={t.questionHint}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B69B00]"
              required
            />
          </div>

          {/* Label Field */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {t.labelField} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={t.labelHint}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B69B00]"
              required
            />
          </div>

          {/* Answer Field */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {t.answerField}
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.answerHint}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B69B00]"
            />
          </div>

          {/* Reciprocal Slider & Chance Calculation */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t.reciprocalField}
              </label>
              <span className="text-xs font-bold text-[#B69B00] dark:text-[#E8D04B] font-mono tabular-nums">
                {probabilityLabel}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
              {t.reciprocalHint}
            </p>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={reciprocal}
                onChange={(e) => setReciprocal(parseInt(e.target.value, 10))}
                className="flex-1 accent-[#B69B00] cursor-pointer"
              />
              <span className="w-8 text-center font-mono font-bold text-sm text-neutral-800 dark:text-neutral-200">
                1/{reciprocal}
              </span>
            </div>
          </div>

          {/* Rewards Pool */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t.rewardsField} ({rewards.length})
              </label>
              {rewards.length === 0 && (
                <button
                  type="button"
                  onClick={handleUseDefaultRewards}
                  className="text-xs text-[#B69B00] hover:underline font-medium"
                >
                  Use Default Suggestions
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newRewardInput}
                onChange={(e) => setNewRewardInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddReward();
                  }
                }}
                placeholder={t.rewardsHint}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B69B00]"
              />
              <button
                type="button"
                onClick={handleAddReward}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addReward}</span>
              </button>
            </div>

            {rewards.length === 0 ? (
              <p className="text-xs italic text-neutral-400 dark:text-neutral-500 py-1">
                {t.noRewardsYet}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {rewards.map((reward, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#B69B00]/10 dark:bg-[#B69B00]/20 text-neutral-800 dark:text-neutral-200 rounded-lg border border-[#B69B00]/20"
                  >
                    <span>{reward}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReward(i)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                      aria-label="Remove reward"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#1E1C16]/50 flex items-center justify-between">
          <div>
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.delete}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl shadow-sm hover:shadow transition-all"
            >
              {t.save}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-6 z-20">
            <div className="w-full max-w-sm p-6 bg-white dark:bg-[#25231B] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {t.confirmDeleteTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
                {t.confirmDeleteMessage}
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    if (activity) onDelete(activity);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
