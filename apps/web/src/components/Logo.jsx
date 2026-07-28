import React from 'react';

const Logo = () => {
  return (
    <div className="relative inline-flex items-center gap-2.5 select-none font-handdrawn mb-2">
      {/* Play Icon Box with irregular yellow hand-drawn border box */}
      <div className="relative">
        <svg className="w-9 h-9 text-yellow-400 transform -rotate-1" viewBox="0 0 44 44" fill="none">
          <rect x="3" y="3" width="38" height="38" rx="10" fill="#0B0E17" stroke="#FFD600" strokeWidth="3" />
          <path d="M17 13 L 31 22 L 17 31 Z" fill="#FFFFFF" />
        </svg>

        {/* Purple & Yellow sketch loops above logo */}
        <svg className="absolute -top-3.5 -right-3.5 w-6 h-6 text-purple-400 opacity-90 pointer-events-none" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 16 C 4 6, 16 4, 22 12 C 26 18, 14 24, 8 18" />
          <path d="M12 8 C 16 6, 20 8, 18 12" stroke="#FFD600" strokeWidth="1.8" />
        </svg>
      </div>

      {/* WATCH PARTY Text and Yellow Underline */}
      <div className="relative pt-0.5">
        <span className="text-lg font-black tracking-widest uppercase text-white font-handdrawn">
          WATCH PARTY
        </span>
        {/* Yellow hand-drawn stroke underline */}
        <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-yellow-400" viewBox="0 0 140 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M 2 5 C 35 2, 75 8, 138 4" />
        </svg>
      </div>
    </div>
  );
};

export default Logo;
