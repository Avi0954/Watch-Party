import React from 'react';

const HeroTitle = () => {
  return (
    <div className="relative my-2 select-none w-full max-w-[500px] font-handdrawn text-center lg:text-left mx-auto lg:mx-0">
      {/* 1. Three colorful scribble loops (purple, white, yellow) top-center above title */}
      <div className="absolute left-[200px] -top-8 pointer-events-none hidden sm:block z-20">
        <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none" strokeLinecap="round">
          <path d="M 12 6 C 8 2, 22 2, 18 10" stroke="#A855F7" strokeWidth="2.2" />
          <path d="M 10 16 C 14 12, 30 12, 24 20" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 22 26 C 28 24, 38 25, 34 29" stroke="#FFD600" strokeWidth="2" />
        </svg>
      </div>

      {/* 2. Pink Video Player Doodle Box to the Left of TOGETHER */}
      <div className="absolute -left-10 sm:-left-12 top-12 sm:top-14 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-pink-400 bg-pink-500/10 flex items-center justify-center text-pink-400 transform -rotate-12 pointer-events-none hidden sm:flex shadow-[0_0_15px_rgba(236,72,153,0.35)] z-20">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-pink-400" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="absolute -top-1 -right-1 text-pink-300 text-xs font-mono">//</span>
      </div>

      {/* 3. White Burst Dashes above Pink Video Box */}
      <div className="absolute -left-6 sm:-left-8 top-4 sm:top-6 text-white/70 text-xs font-mono pointer-events-none hidden sm:block">
        \ | /
      </div>

      {/* 4. Purple Smiley Face Doodle top-right of WATCH */}
      <div className="absolute right-2 -top-4 w-9 h-9 sm:w-11 sm:h-11 text-purple-400 opacity-90 pointer-events-none hidden sm:block z-20">
        <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="18" cy="18" r="15" />
          <circle cx="12" cy="14" r="1.8" fill="currentColor" />
          <circle cx="24" cy="14" r="1.8" fill="currentColor" />
          <path d="M11 22 C 14 27, 22 27, 25 22" />
        </svg>
      </div>

      {/* 5. White Crosshairs Doodle bottom-left of REAL-TIME */}
      <div className="absolute -left-8 sm:-left-10 bottom-4 sm:bottom-6 text-white/70 text-xs font-mono pointer-events-none hidden sm:block">
        + o .
      </div>

      {/* 6. Main 4-Line Hero Title with Per-Character Micro-Tilts */}
      <h1 className="text-[clamp(2.75rem,5.2vw,4.65rem)] font-black leading-[0.88] tracking-tight uppercase font-handdrawn text-center lg:text-left">
        {/* Line 1: WATCH */}
        <div className="text-white relative inline-block">
          <span className="inline-block transform -rotate-[1.5deg]">W</span>
          <span className="inline-block transform rotate-[1.2deg]">A</span>
          <span className="inline-block transform -rotate-[0.8deg]">T</span>
          <span className="inline-block transform rotate-[1.5deg]">C</span>
          <span className="inline-block transform -rotate-[1.2deg]">H</span>
        </div>
        <br />

        {/* Line 2: TOGETHER. */}
        <div className="text-[#FFD600] inline-block font-black">
          <span className="inline-block transform rotate-[1.2deg]">T</span>
          <span className="inline-block transform -rotate-[1.5deg]">O</span>
          <span className="inline-block transform rotate-[0.8deg]">G</span>
          <span className="inline-block transform -rotate-[1.2deg]">E</span>
          <span className="inline-block transform rotate-[1.4deg]">T</span>
          <span className="inline-block transform -rotate-[0.9deg]">H</span>
          <span className="inline-block transform rotate-[1.1deg]">E</span>
          <span className="inline-block transform -rotate-[1.4deg]">R</span>
          <span className="inline-block transform rotate-[1.0deg]">.</span>
        </div>
        <br />

        {/* Line 3: ANYWHERE. */}
        <div className="text-white inline-block relative">
          <span className="inline-block transform -rotate-[1.2deg]">A</span>
          <span className="inline-block transform rotate-[1.4deg]">N</span>
          {/* Metallic Silver/Translucent Textured 'Y' */}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-300 to-slate-500 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform -rotate-[1.8deg] -translate-y-[1px]">
            Y
          </span>
          <span className="inline-block transform rotate-[0.9deg]">W</span>
          <span className="inline-block transform -rotate-[1.3deg]">H</span>
          <span className="inline-block transform rotate-[1.1deg]">E</span>
          <span className="inline-block transform -rotate-[1.5deg]">R</span>
          <span className="inline-block transform rotate-[0.8deg]">E</span>
          <span className="inline-block transform -rotate-[1.0deg]">.</span>
        </div>
        <br />

        {/* Line 4: REAL-TIME. */}
        <div className="relative inline-block text-[#A855F7]">
          <span className="font-black drop-shadow-[0_0_18px_rgba(168,85,247,0.4)]">
            <span className="inline-block transform rotate-[1.5deg] -translate-y-[1px]">R</span>
            <span className="inline-block transform -rotate-[1.2deg]">E</span>
            <span className="inline-block transform rotate-[0.8deg]">A</span>
            <span className="inline-block transform -rotate-[1.4deg]">L</span>
            <span className="inline-block transform rotate-[0deg]">-</span>
            <span className="inline-block transform rotate-[1.3deg]">T</span>
            <span className="inline-block transform -rotate-[1.1deg]">I</span>
            <span className="inline-block transform rotate-[1.5deg]">M</span>
            <span className="inline-block transform -rotate-[0.9deg]">E</span>
            <span className="inline-block transform rotate-[1.2deg] translate-y-[1px]">.</span>
          </span>

          {/* Nearly horizontal hand-drawn wavy purple underline accent */}
          <svg className="absolute -bottom-2.5 right-0 w-[55%] min-w-[160px] h-3.5 text-[#A855F7] pointer-events-none opacity-90" viewBox="0 0 210 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M 2 7 C 35 3, 75 11, 115 5 Q 165 2, 208 6" />
          </svg>

          {/* Yellow 4-Point Star Doodle */}
          <svg className="absolute -right-7 sm:-right-9 top-2 sm:top-3 w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400/40 transform rotate-12 opacity-95 pointer-events-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>
      </h1>
    </div>
  );
};

export default HeroTitle;
