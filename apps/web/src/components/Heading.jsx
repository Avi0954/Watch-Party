import React from 'react';

const Heading = () => {
  return (
    <div className="relative my-3 lg:my-5 select-none font-display">
      {/* Pink Video Player doodle to the left of TOGETHER */}
      <div className="absolute -left-10 top-16 w-9 h-9 rounded-lg border-2 border-pink-400 bg-pink-500/10 flex items-center justify-center text-pink-400 rotate-[-12deg] pointer-events-none hidden sm:flex shadow-[0_0_10px_rgba(236,72,153,0.3)]">
        <svg className="w-5 h-5 fill-pink-400" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      </div>

      {/* Purple Smiley Face doodle top right of heading */}
      <div className="absolute right-2 -top-10 w-12 h-12 text-purple-400 opacity-90 pointer-events-none hidden sm:block">
        <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="18" cy="18" r="15" />
          <circle cx="12" cy="14" r="1.8" fill="currentColor" />
          <circle cx="24" cy="14" r="1.8" fill="currentColor" />
          <path d="M11 22 C 14 27, 22 27, 25 22" />
        </svg>
      </div>

      <h1 className="text-[68px] sm:text-[76px] lg:text-[82px] font-black leading-[0.9] tracking-tight uppercase">
        {/* Line 1: WATCH */}
        <div className="text-white relative inline-block">
          WATCH
        </div>
        <br />

        {/* Line 2: TOGETHER. */}
        <div className="text-[#FFD600] inline-block font-black">
          TOGETHER.
        </div>
        <br />

        {/* Line 3: ANYWHERE. */}
        <div className="text-white inline-block relative">
          AN<span className="relative text-white/80">Y<span className="absolute inset-0 text-slate-400/50 blur-[0.5px]">Y</span></span>WHERE.
        </div>
        <br />

        {/* Line 4: REAL-TIME. */}
        <div className="relative inline-block">
          {/* White crosshairs sparkle doodle */}
          <span className="absolute -left-7 top-3 text-white/80 text-base font-semibold pointer-events-none">+</span>
          
          <span className="text-[#A855F7] drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            REAL-TIME.
          </span>
          
          {/* Wavy Purple Hand-Drawn Underline */}
          <svg className="absolute -bottom-3 left-0 w-full h-4" viewBox="0 0 240 16" fill="none" stroke="#A855F7" strokeWidth="3.8" strokeLinecap="round">
            <path d="M2 8 C 35 1, 70 13, 105 4 C 140 -3, 185 13, 238 5" />
          </svg>

          {/* Yellow Star Doodle */}
          <svg className="absolute -right-8 top-2 w-6 h-6 text-yellow-400 fill-yellow-400/30" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>
      </h1>
    </div>
  );
};

export default Heading;
