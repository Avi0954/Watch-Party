import React from 'react';

const Stats = () => {
  return (
    <div className="flex items-center gap-3 my-4 select-none font-handdrawn">
      {/* 4 Overlapping Avatar Badges */}
      <div className="flex -space-x-2.5">
        {/* Pink Piggy */}
        <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
          </svg>
        </div>

        {/* Yellow Piggy */}
        <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
          </svg>
        </div>

        {/* Purple Piggy */}
        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#070B17] flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
          </svg>
        </div>

        {/* Cyan Piggy */}
        <div className="w-8 h-8 rounded-full bg-cyan-400 border-2 border-[#070B17] flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white fill-white/20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <ellipse cx="12" cy="14" rx="2.5" ry="1.5" />
          </svg>
        </div>
      </div>

      {/* Stats Label */}
      <div className="relative text-xs sm:text-sm font-black tracking-wider uppercase text-white font-handdrawn">
        <span>2,000+ PARTIES </span>
        <span className="relative">
          HAPPENING TODAY
          {/* Yellow underline under HAPPENING TODAY */}
          <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 130 8" fill="none" stroke="#FFD600" strokeWidth="2.4" strokeLinecap="round">
            <path d="M2 4 C 35 1, 70 6, 128 3" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Stats;
