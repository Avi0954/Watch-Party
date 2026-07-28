import React from 'react';
import { Ghost, Cat, Dog, Bot, Smile, Sparkles } from 'lucide-react';

const AVATARS = [
  { id: 'ghost', icon: Ghost, color: 'bg-purple-600', stroke: 'text-purple-400' },
  { id: 'cat', icon: Cat, color: 'bg-slate-800', stroke: 'text-slate-400' },
  { id: 'bear', icon: Dog, color: 'bg-amber-950/60', stroke: 'text-amber-600' },
  { id: 'bot', icon: Bot, color: 'bg-[#112338]', stroke: 'text-cyan-400' },
  { id: 'smile', icon: Smile, color: 'bg-[#2A2415]', stroke: 'text-yellow-400' },
  { id: 'sparkles', icon: Sparkles, color: 'bg-[#2C182A]', stroke: 'text-pink-400' },
];

const AvatarPicker = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="space-y-4">
      {/* Title with Pink Accent Underline */}
      <div className="relative text-center">
        {/* Tiny sparkle accent above title */}
        <span className="absolute -top-3 left-[calc(50%-50px)] text-pink-400 text-xs font-bold pointer-events-none">✨</span>
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-200 inline-block relative pb-1">
          PICK YOUR VIBE
          {/* Pink curved scribble line */}
          <svg className="absolute -bottom-1 left-0 w-full h-2.5" viewBox="0 0 110 10" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 5 C 30 1, 60 7, 108 4" />
          </svg>
        </span>
      </div>

      {/* Avatar Row inside Dark Rounded Container */}
      <div className="flex items-center justify-between bg-[#0B0F19] p-3.5 rounded-2xl border border-white/5 shadow-inner">
        {AVATARS.map((av) => {
          const Icon = av.icon;
          const isSelected = selectedAvatar === av.id;

          return (
            <button
              key={av.id}
              type="button"
              onClick={() => onSelectAvatar(av.id)}
              className="relative group focus:outline-none transition-all duration-200"
            >
              {/* Crown / Burst lines for Ghost (Selected state) */}
              {isSelected && (
                <svg
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 text-white pointer-events-none animate-pulse"
                  viewBox="0 0 24 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 10 L 7 3 L 12 7 L 17 3 L 20 10" />
                </svg>
              )}

              {/* Circle Container */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                  ? 'bg-purple-600 border-2 border-white shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-110'
                  : 'bg-[#141A28] border border-white/10 hover:border-white/30 hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : av.stroke}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;
