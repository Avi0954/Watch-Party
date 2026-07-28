import React from 'react';
import FeatureRow from './FeatureRow';

const HeroSection = () => {
  return (
    <div className="relative flex flex-col justify-between h-full max-w-[540px] text-white py-2 lg:py-4">
      {/* Top Logo Badge */}
      <div className="relative inline-flex items-center gap-3 w-fit">
        {/* Play Icon Badge with hand-drawn style box */}
        <div className="relative">
          <div className="w-9 h-9 bg-[#111522] border-2 border-yellow-400 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.2)]">
            <svg className="w-5 h-5 text-white fill-white ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Top-Right tiny purple sketch loops doodle above logo */}
          <svg className="absolute -top-4 -right-4 w-6 h-6 text-purple-400 opacity-80 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 14 C 4 6, 14 4, 18 10 C 22 16, 12 20, 8 16" />
          </svg>
        </div>

        {/* Text and Underline */}
        <div className="relative">
          <span className="text-xl font-black tracking-wider uppercase text-white font-sans">
            WATCH PARTY
          </span>
          {/* Yellow scribble underline */}
          <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 130 12" fill="none" stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 6 C 35 1, 70 9, 128 5" />
          </svg>
        </div>
      </div>

      {/* Main Heading Section */}
      <div className="relative my-4 lg:my-6 space-y-1">
        {/* Doodle: Pink Video Player on the left of TOGETHER */}
        <div className="absolute -left-10 top-16 w-8 h-8 rounded border-2 border-pink-400/80 bg-pink-500/10 flex items-center justify-center text-pink-400 rotate-[-12deg] pointer-events-none hidden sm:flex">
          <svg className="w-4 h-4 fill-pink-400" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>

        {/* Doodle: Smiley face top right of heading area */}
        <div className="absolute right-0 -top-8 w-10 h-10 text-purple-400 opacity-90 pointer-events-none hidden sm:block">
          <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="18" cy="18" r="15" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            <circle cx="24" cy="14" r="1.5" fill="currentColor" />
            <path d="M11 22 C 14 27, 22 27, 25 22" />
          </svg>
        </div>

        <h1 className="text-[64px] sm:text-[72px] lg:text-[78px] font-black leading-[0.92] tracking-tight uppercase select-none">
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
            AN<span className="relative text-white/90">Y<span className="absolute inset-0 text-gray-400/40 blur-[1px]">Y</span></span>WHERE.
          </div>
          <br />

          {/* Line 4: REAL-TIME. */}
          <div className="relative inline-block">
            {/* White crosshair sparkle doodle to left of REAL-TIME */}
            <span className="absolute -left-7 top-3 text-white/70 text-sm font-normal pointer-events-none">+</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              REAL-TIME.
            </span>
            {/* Purple wavy hand-drawn underline */}
            <svg className="absolute -bottom-3 left-0 w-full h-4" viewBox="0 0 220 16" fill="none" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round">
              <path d="M2 8 C 30 1, 60 12, 90 4 C 120 -2, 160 12, 218 5" />
            </svg>
            {/* Yellow star sparkle doodle to right of REAL-TIME */}
            <svg className="absolute -right-7 top-2 w-5 h-5 text-yellow-400 fill-yellow-400/30" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          </div>
        </h1>
      </div>

      {/* Subtitle / Description */}
      <div className="relative max-w-[480px] text-gray-300 text-[16px] lg:text-[17px] font-medium leading-relaxed my-2">
        <p>
          Create a room, invite your friends,
        </p>
        <p className="flex items-center gap-1.5 flex-wrap">
          <span>and enjoy</span>
          <span className="relative font-semibold text-white px-0.5">
            perfectly synced
            {/* Pink hand-drawn underline under perfectly synced */}
            <svg className="absolute -bottom-1 left-0 w-full h-2.5" viewBox="0 0 140 10" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 5 C 35 1, 70 7, 138 4" />
            </svg>
          </span>
          <span>videos</span>
        </p>
        <div className="flex items-center gap-2">
          <span>with real-time chat.</span>
          {/* Yellow curved arrow pointing down towards stats */}
          <svg className="w-5 h-5 text-yellow-400 rotate-12 inline-block stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 4 C 12 3, 17 8, 17 17" />
            <path d="M11 14 L 17 17 L 19 11" />
          </svg>
        </div>
      </div>

      {/* User Count & Avatars Row */}
      <div className="flex items-center gap-3 my-3">
        {/* Overlapping 4 Cute Doodle Avatars */}
        <div className="flex -space-x-2.5">
          {/* Avatar 1: Pink Piggy */}
          <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="8" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
            </svg>
          </div>

          {/* Avatar 2: Yellow Piggy */}
          <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="8" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
            </svg>
          </div>

          {/* Avatar 3: Purple Piggy */}
          <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="8" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
            </svg>
          </div>

          {/* Avatar 4: Cyan Piggy */}
          <div className="w-8 h-8 rounded-full bg-cyan-400 border-2 border-[#070B17] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="8" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
            </svg>
          </div>
        </div>

        {/* Stats Text */}
        <div className="relative text-xs sm:text-sm font-extrabold tracking-wider uppercase text-white">
          <span>2,000+ PARTIES </span>
          <span className="relative">
            HAPPENING TODAY
            {/* Yellow underline under HAPPENING TODAY */}
            <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 130 8" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round">
              <path d="M2 4 C 35 1, 70 6, 128 3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Bottom Features Row */}
      <FeatureRow />
    </div>
  );
};

export default HeroSection;
