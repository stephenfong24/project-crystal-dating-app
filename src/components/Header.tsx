import React from 'react';
import { Volume2, VolumeX, Share2, Sparkles, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCustomize: () => void;
  onReset: () => void;
  currentStep: 'question' | 'planner' | 'pass';
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenCustomize,
  onReset,
  currentStep,
}) => {
  return (
    <header className="relative z-20 w-full border-b border-rose-100/80 bg-white/75 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-lg p-1"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-rose-600 group-hover:text-rose-700 transition-colors">
            datewithme<span className="text-pink-400">.</span>
          </span>
        </button>

        {/* Zone 2: Navigation status links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <button
            onClick={onReset}
            className={`transition-colors hover:text-rose-600 ${
              currentStep === 'question' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            The Question
          </button>
          <span className="text-slate-300">·</span>
          <span
            className={`transition-colors ${
              currentStep === 'planner'
                ? 'text-rose-600 font-semibold'
                : currentStep === 'pass'
                ? 'text-slate-700'
                : 'text-slate-400'
            }`}
          >
            Date Planner
          </span>
          <span className="text-slate-300">·</span>
          <span
            className={`transition-colors ${
              currentStep === 'pass' ? 'text-rose-600 font-semibold' : 'text-slate-400'
            }`}
          >
            VIP Date Pass
          </span>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleMute}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-rose-500" />}
          </button>

          {currentStep !== 'question' && (
            <button
              onClick={() => {
                sounds.playPop();
                onReset();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
              title="Start over"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onOpenCustomize();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/90 border border-rose-200/80 rounded-xl transition-all shadow-xs hover:shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="whitespace-nowrap">Customize & Share</span>
          </button>
        </div>
      </div>
    </header>
  );
};
