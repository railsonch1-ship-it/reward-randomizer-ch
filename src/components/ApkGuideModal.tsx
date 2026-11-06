import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Terminal, Download, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../services/audio';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const gitCommands = `git init
git add .
git commit -m "feat: Reward Randomizer Android APK project"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#25231B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[88vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-[#F6F3DF] leading-tight">
                Como Gerar o APK pelo GitHub
              </h2>
              <p className="text-[11px] text-neutral-500">
                GitHub Actions compila o APK automaticamente a cada push
              </p>
            </div>
          </div>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-700 dark:text-neutral-300 text-xs">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#B69B00] text-white flex items-center justify-center text-xs font-mono">
                1
              </span>
              <span>Suba este projeto para o seu GitHub</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Execute estes comandos no terminal da pasta do projeto para enviar o código:
            </p>

            <div className="relative rounded-2xl bg-neutral-900 text-neutral-200 p-3.5 font-mono text-[11px] leading-relaxed select-all">
              <button
                onClick={() => copyToClipboard(gitCommands, 1)}
                className="absolute top-2.5 right-2.5 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] text-neutral-300 flex items-center gap-1 transition-colors"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 1 ? 'Copiado!' : 'Copiar'}</span>
              </button>
              <pre className="pr-16 overflow-x-auto">{gitCommands}</pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#B69B00] text-white flex items-center justify-center text-xs font-mono">
                2
              </span>
              <span>O GitHub compilará o APK automaticamente</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Workflow pronto: .github/workflows/build_apk.yml</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                Assim que você der o <code>git push</code>, o GitHub Actions inicia a compilação do APK do Android em nuvem (leva ~2 minutos).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#B69B00] text-white flex items-center justify-center text-xs font-mono">
                3
              </span>
              <span>Baixe e instale no seu Android</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
              <li>Acesse a aba <strong>Actions</strong> no seu repositório no GitHub.</li>
              <li>Clique na execução <strong>"Build Android APK"</strong> concluída.</li>
              <li>Na seção <strong>Artifacts</strong>, baixe o arquivo <strong>RewardRandomizer-Release-APK</strong>.</li>
              <li>Abra o arquivo <strong>.apk</strong> no seu celular e toque em <strong>Instalar</strong>!</li>
            </ol>
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
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
