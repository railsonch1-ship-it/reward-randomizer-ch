import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';
import { X, Copy, Check, Download, FileCode, FolderTree } from 'lucide-react';
import { soundEffects } from '../services/audio';

interface FlutterCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeViewerModal: React.FC<FlutterCodeViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    soundEffects.playClick();
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-[#1E1C16] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-[#F6F3DF]/60 dark:bg-[#191813]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B69B00] text-white flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-[#F6F3DF] leading-tight">
                Flutter Source Codebase
              </h2>
              <p className="text-xs text-neutral-500">
                Complete, production-ready Flutter/Dart project structure (`chiralsymmetry/reward-randomizer`)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors"
              title="Download selected file"
            >
              <Download className="w-3.5 h-3.5 text-[#B69B00]" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#B69B00] hover:bg-[#9E8600] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace: File Tree Sidebar & Code Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: File Tree */}
          <div className="w-full md:w-72 bg-neutral-50/70 dark:bg-[#161511] border-r border-neutral-100 dark:border-neutral-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Project Explorer
            </div>

            {FLUTTER_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedFile(file);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-[#B69B00]/20 text-[#726100] dark:text-[#E8D04B] font-semibold border border-[#B69B00]/30'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#B69B00]' : 'text-neutral-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1 truncate">
                    <div className="font-mono text-[11px] truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Editor Pane */}
          <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900 text-neutral-100">
            {/* File Path & Info */}
            <div className="px-4 py-2.5 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[#B69B00] font-semibold truncate">{selectedFile.path}</span>
              <span className="text-neutral-500 text-[11px]">{selectedFile.description}</span>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed select-text">
              <pre className="text-neutral-200">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
