import React from 'react';

const AvatarSelector = ({ selectedAvatar, onSelectAvatar }) => {
  const avatarList = [
    {
      id: 'ghost',
      name: 'Ghost',
      glowColor: 'shadow-[0_0_24px_rgba(99,102,241,0.5)]',
      renderIcon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C8.5 4 6 6.5 6 10v9l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2V10c0-3.5-2.5-6-6-6z" fill="#FFFFFF" />
          <circle cx="9.5" cy="10" r="1.1" fill="#000000" />
          <circle cx="14.5" cy="10" r="1.1" fill="#000000" />
          <path d="M11 13.5 C 12 14.5, 13 14.5, 13 13.5" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      )
    },
    {
      id: 'cat',
      name: 'Cat',
      glowColor: 'shadow-[0_0_24px_rgba(168,85,247,0.5)]',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
          <path d="M7 11 L10 6 L12 11 Z" fill="#282C37" />
          <path d="M21 11 L18 6 L16 11 Z" fill="#282C37" />
          <circle cx="14" cy="15" r="7.5" fill="#282C37" />
          <circle cx="11.5" cy="14" r="1.1" fill="#FFFFFF" />
          <circle cx="16.5" cy="14" r="1.1" fill="#FFFFFF" />
          <polygon points="13,16 15,16 14,17" fill="#FFB6C1" />
          <line x1="5" y1="14" x2="9" y2="15" stroke="#4A5264" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="23" y1="14" x2="19" y2="15" stroke="#4A5264" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'bear',
      name: 'Bear',
      glowColor: 'shadow-[0_0_24px_rgba(210,144,84,0.5)]',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
          <circle cx="8" cy="8.5" r="3.2" fill="#7C4116" />
          <circle cx="20" cy="8.5" r="3.2" fill="#7C4116" />
          <circle cx="14" cy="15" r="8" fill="#7C4116" />
          <ellipse cx="14" cy="16.5" rx="3.8" ry="2.8" fill="#D29054" />
          <circle cx="14" cy="15.2" r="1.2" fill="#000000" />
          <circle cx="10.8" cy="13.5" r="1" fill="#000000" />
          <circle cx="17.2" cy="13.5" r="1" fill="#000000" />
        </svg>
      )
    },
    {
      id: 'bot',
      name: 'Robot',
      glowColor: 'shadow-[0_0_24px_rgba(0,229,255,0.5)]',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
          <rect x="6" y="9" width="16" height="12" rx="2.5" fill="#0D2C3B" stroke="#00E5FF" strokeWidth="1.8" />
          <line x1="14" y1="4" x2="14" y2="9" stroke="#00E5FF" strokeWidth="1.8" />
          <rect x="12" y="3" width="4" height="2" rx="1" fill="#00E5FF" />
          <circle cx="10.5" cy="14" r="1.5" fill="#00E5FF" />
          <circle cx="17.5" cy="14" r="1.5" fill="#00E5FF" />
          <line x1="10" y1="18" x2="18" y2="18" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'smile',
      name: 'Smiley',
      glowColor: 'shadow-[0_0_24px_rgba(255,214,0,0.5)]',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="9" fill="#FFD600" />
          <circle cx="10.5" cy="12" r="1.2" fill="#000000" />
          <circle cx="17.5" cy="12" r="1.2" fill="#000000" />
          <path d="M9.5 16 C 11.5 19.5, 16.5 19.5, 18.5 16" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )
    },
    {
      id: 'sparkles',
      name: 'Sparkles',
      glowColor: 'shadow-[0_0_24px_rgba(236,72,153,0.5)]',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
          <path d="M14 4 L16.5 11.5 L24 14 L16.5 16.5 L14 24 L11.5 16.5 L4 14 L11.5 11.5 Z" fill="#EC4899" />
          <path d="M6.5 5.5 L7.2 8 L9.5 8.7 L7.2 9.4 L6.5 11.8 L5.8 9.4 L3.5 8.7 L5.8 8 Z" fill="#EC4899" opacity="0.85" />
          <path d="M21.5 18.5 L22.2 20.8 L24.5 21.5 L22.2 22.2 L21.5 24.5 L20.8 22.2 L18.5 21.5 L20.8 20.8 Z" fill="#EC4899" opacity="0.85" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4 select-none font-handdrawn">
      {/* Left-Aligned Label with Double Pink Accent Underline */}
      <div className="relative text-left ml-1 pt-1">
        <span className="relative inline-block text-sm sm:text-base font-black uppercase tracking-[0.2em] text-gray-100 pb-1">
          PICK YOUR VIBE
          
          {/* Double-stroke pink hand-drawn underline */}
          <svg className="absolute -bottom-1.5 left-0 w-full h-3" viewBox="0 0 140 12" fill="none" stroke="#EC4899" strokeWidth="2.8" strokeLinecap="round">
            <path d="M 2 5 C 40 1, 90 8, 138 4" />
            <path d="M 12 8 C 50 4, 100 10, 130 6" strokeWidth="2" />
          </svg>

          {/* Top-right purple slashes doodle */}
          <span className="absolute -top-3.5 -right-7 text-purple-400 opacity-90 text-sm font-bold pointer-events-none font-mono">//</span>
        </span>
      </div>

      {/* Row of 6 Custom Vector Avatars */}
      <div className="flex items-center justify-between py-3.5 px-0.5 mt-2">
        {avatarList.map((avatar) => {
          const isSelected = selectedAvatar === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.id)}
              className="relative group focus:outline-none transition-all duration-200 hover:scale-105"
            >
              {/* White burst lines above whichever avatar is selected */}
              {isSelected && (
                <svg className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-3 text-white pointer-events-none z-20" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="4" y1="10" x2="2" y2="2" />
                  <line x1="12" y1="10" x2="12" y2="1" />
                  <line x1="20" y1="10" x2="22" y2="2" />
                </svg>
              )}

              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Rough sketchy outer dashed circle ring around whichever avatar is selected */}
                {isSelected && (
                  <svg className="absolute -inset-1 w-14 h-14 text-white pointer-events-none z-10" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3">
                    <circle cx="28" cy="28" r="25" />
                  </svg>
                )}

                {/* Avatar Icon Circle with Soft Glow when selected */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${avatar.id === 'ghost' ? 'bg-[#6366F1]' : 'bg-[#171B28] border border-white/10'
                  } ${isSelected ? `${avatar.glowColor} scale-105 opacity-100 border-white/40` : 'opacity-50 hover:opacity-100'}`}>
                  {avatar.renderIcon()}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSelector;
