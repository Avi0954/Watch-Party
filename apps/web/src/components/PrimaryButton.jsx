import React from 'react';
import { Plus } from 'lucide-react';

const PrimaryButton = ({ onClick, loading, text = "CREATE WATCH PARTY" }) => {
  return (
    <div className="space-y-3 select-none font-handdrawn">
      {/* Button Container with Hand-Drawn Dense Scribble Border Overlay */}
      <div className="relative group">
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className="relative w-full h-[64px] bg-[#6366F1] hover:bg-[#575AE6] hover:-translate-y-0.5 text-black font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 rounded-2xl shadow-[0_10px_25px_rgba(99,102,241,0.35)] active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed z-10 font-handdrawn"
        >
          <Plus className="w-6 h-6 stroke-[2.8] text-black" />
          <span className="font-bold text-base sm:text-lg tracking-wider text-black">{loading ? 'CREATING...' : text}</span>
        </button>

        {/* Hand-Drawn Dense Black Scribble Overlay */}
        <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] text-[#070B17] pointer-events-none z-20" viewBox="0 0 440 84" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Bottom-Left Corner Dense Scribble Loops */}
          <path d="M 6 52 C -2 60, 14 74, 6 80 C 18 70, 2 56, 12 76 M 12 60 C 2 70, 20 80, 16 68 M 22 66 C 14 76, 28 82, 24 72" strokeWidth="2.2" />

          {/* Bottom Center Small Scribble Cluster */}
          <path d="M 170 74 C 162 82, 185 84, 178 74 C 188 84, 198 76, 192 82 M 175 76 Q 185 84, 195 78" strokeWidth="2" />

          {/* Bottom-Right Corner & Right Vertical Edge Dense Scribble Loops */}
          <path d="M 412 45 C 428 50, 420 68, 432 75 C 422 62, 435 52, 428 78 M 418 60 C 434 65, 425 80, 436 82 M 424 30 C 438 35, 428 48, 436 55 M 428 12 C 438 18, 432 30, 438 38" strokeWidth="2.5" />

          {/* Top-Right Corner Scribble Loop Tip */}
          <path d="M 418 4 C 430 0, 436 12, 425 18 M 424 2 Q 436 8, 430 16" strokeWidth="2" />
        </svg>
      </div>

      {/* Subtext under button: "NO SIGNUP. JUST VIBES." */}
      <div className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400/90 flex items-center justify-center gap-1.5 font-handdrawn">
        <span>NO SIGNUP. JUST VIBES.</span>

        {/* Three angled burst lines on right */}
        <svg className="w-4 h-4 text-purple-400 pointer-events-none opacity-90 stroke-[2]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round">
          <line x1="2" y1="4" x2="10" y2="2" />
          <line x1="2" y1="8" x2="12" y2="8" />
          <line x1="4" y1="12" x2="10" y2="14" />
        </svg>
      </div>
    </div>
  );
};

export default PrimaryButton;
