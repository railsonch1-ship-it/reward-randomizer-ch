import React, { useState } from 'react';
import { X, ExternalLink, Dices, Brain, Award, ShieldCheck, ChevronRight } from 'lucide-react';
import { translations } from '../l10n/translations';
import { soundEffects } from '../services/audio';

interface AboutModalProps {
  isOpen: boolean;
  currentLang: 'en' | 'sv' | 'pt';
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, currentLang, onClose }) => {
  const t = translations[currentLang];
  const [showLicenses, setShowLicenses] = useState(false);

  if (!isOpen) return null;

  const thirdPartyPackages = [
    { name: 'flutter_riverpod', version: '^2.3.6', license: 'MIT' },
    { name: 'font_awesome_flutter', version: '^10.4.0', license: 'MIT' },
    { name: 'intl', version: '^0.18.0', license: 'BSD-3-Clause' },
    { name: 'shared_preferences', version: '^2.1.1', license: 'BSD-3-Clause' },
    { name: 'sqflite', version: '^2.2.8+4', license: 'BSD-2-Clause' },
    { name: 'url_launcher', version: '^6.1.11', license: 'BSD-3-Clause' },
    { name: 'uuid', version: '^3.0.7', license: 'MIT' },
    { name: 'auto_size_text', version: '^3.0.0', license: 'MIT' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#25231B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-[#F6F3DF]">
            {showLicenses ? t.thirdPartyLicenses : t.about}
          </h2>
          <button
            onClick={() => {
              soundEffects.playClick();
              if (showLicenses) {
                setShowLicenses(false);
              } else {
                onClose();
              }
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-700 dark:text-neutral-300">
          {showLicenses ? (
            <div className="space-y-4">
              <p className="text-xs text-neutral-500">
                Reward Randomizer uses the following open source libraries and packages:
              </p>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {thirdPartyPackages.map((pkg) => (
                  <div key={pkg.name} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {pkg.name}
                      </span>
                      <span className="ml-2 text-neutral-400 font-mono">{pkg.version}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">
                      {pkg.license}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowLicenses(false)}
                className="mt-4 text-xs font-semibold text-[#B69B00] hover:underline"
              >
                ← Back to About
              </button>
            </div>
          ) : (
            <>
              {/* App Identity */}
              <div className="text-center pb-2">
                <div className="w-16 h-16 rounded-2xl bg-[#B69B00]/15 text-[#B69B00] dark:bg-[#B69B00]/25 dark:text-[#E8D04B] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Dices className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-[#F6F3DF]">
                  Reward Randomizer
                </h3>
                <p className="text-xs font-medium text-[#726100] dark:text-[#B69B00] mt-1">
                  Variable-Ratio Habit Engine
                </p>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t.aboutDesc}
              </p>

              {/* Psychology of Intermittent Reinforcement */}
              <div className="p-4 rounded-2xl bg-[#B69B00]/10 dark:bg-[#B69B00]/15 border border-[#B69B00]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-[#F6F3DF]">
                  <Brain className="w-4 h-4 text-[#B69B00]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {t.reinforcementExplanation}
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 leading-normal">
                  <div className="flex items-start gap-2">
                    <span className="text-[#B69B00] font-bold mt-0.5">•</span>
                    <p>{t.reinforcementPoint1}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#B69B00] font-bold mt-0.5">•</span>
                    <p>{t.reinforcementPoint2}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#B69B00] font-bold mt-0.5">•</span>
                    <p>{t.reinforcementPoint3}</p>
                  </div>
                </div>
              </div>

              {/* External Link: GitHub */}
              <div className="pt-2">
                <a
                  href="https://github.com/chiralsymmetry/reward-randomizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-800 hover:border-[#B69B00]/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#B69B00]" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.githubRepo}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#B69B00] transition-colors" />
                </a>
              </div>

              {/* Third-Party Licenses trigger */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowLicenses(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1E1C16] border border-neutral-200 dark:border-neutral-800 hover:border-[#B69B00]/50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#B69B00]" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.thirdPartyLicenses}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#B69B00] transition-colors" />
                </button>
              </div>
            </>
          )}
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
