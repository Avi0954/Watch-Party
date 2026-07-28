import React from 'react';

const Description = () => {
  return (
    <div className="relative max-w-[410px] text-gray-300/90 text-[clamp(0.95rem,1.2vw,1.1rem)] font-medium leading-[1.72] my-2.5 select-none font-handdrawn text-center lg:text-left mx-auto lg:mx-0">
      <p>
        Create a room, invite your friends,
      </p>
      <p className="flex items-center justify-center lg:justify-start gap-1.5 flex-wrap">
        <span>and enjoy</span>
        <span className="relative font-bold text-white px-0.5">
          perfectly synced
          {/* Thin Pink hand-drawn underline */}
          <svg className="absolute -bottom-1 left-0 w-full h-2.5" viewBox="0 0 140 10" fill="none" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round">
            <path d="M 2 5 C 35 1, 70 7, 138 4" />
          </svg>
        </span>
        <span>videos</span>
      </p>
      <div className="flex items-center justify-center lg:justify-start gap-2">
        <span>with real-time chat.</span>
        {/* Yellow curved arrow doodle */}
        <svg className="w-4 h-4 text-yellow-400 rotate-12 inline-block stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 4 C 12 3, 17 8, 17 17" />
          <path d="M11 14 L 17 17 L 19 11" />
        </svg>
      </div>
    </div>
  );
};

export default Description;
