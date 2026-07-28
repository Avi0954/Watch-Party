import React from 'react';
import { motion } from 'framer-motion';

const FriendsLoader = ({ statusMessage }) => {
  const avatars = [
    { id: 'ghost', color: 'bg-indigo-500', label: '👻' },
    { id: 'cat', color: 'bg-purple-600', label: '🐱' },
    { id: 'bear', color: 'bg-amber-700', label: '🐻' },
    { id: 'bot', color: 'bg-cyan-500', label: '🤖' },
    { id: 'smile', color: 'bg-yellow-400', label: '😊' },
    { id: 'sparkles', color: 'bg-pink-500', label: '✨' }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 select-none font-handdrawn">
      {/* Circle of Friends Joining Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Outer Ring Circle */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20" />

        {/* Center Watch Party Badge */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-[#111522] border-2 border-purple-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider">PARTY</span>
          <span className="text-xs font-black text-white">READY</span>
        </div>

        {/* 6 Avatars Joining Circle One by One */}
        {avatars.map((av, idx) => {
          const angle = (idx * 60 * Math.PI) / 180;
          const radius = 75; // px distance from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={av.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.25,
                ease: 'backOut'
              }}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className={`absolute w-10 h-10 rounded-full ${av.color} border-2 border-white/90 flex items-center justify-center text-sm shadow-md z-20`}
            >
              {av.label}
            </motion.div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="text-center space-y-2">
        <p className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#FFD600]">
          {statusMessage}
        </p>

        {/* Animated Yellow Stroke Underline */}
        <svg className="w-48 h-3 text-[#FFD600] mx-auto" viewBox="0 0 160 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <motion.path
            d="M 2 5 C 40 1, 80 9, 120 4 C 140 1, 155 7, 158 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default FriendsLoader;
