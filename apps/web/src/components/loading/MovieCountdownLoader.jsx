import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MovieCountdownLoader = ({ statusMessage }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer1 = setTimeout(() => setCount(2), 450);
    const timer2 = setTimeout(() => setCount(1), 900);
    const timer3 = setTimeout(() => setCount(0), 1350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-8 select-none font-handdrawn w-full max-w-[600px]">
      {/* Floating Doodles Around Center */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-12 -top-12 text-white/50 text-xs font-mono pointer-events-none hidden sm:block"
      >
        \ | /
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4], rotate: [8, -8, 8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-10 -top-8 text-purple-400 opacity-80 pointer-events-none hidden sm:block"
      >
        <svg className="w-10 h-10" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="18" cy="18" r="15" />
          <circle cx="12" cy="14" r="1.8" fill="currentColor" />
          <circle cx="24" cy="14" r="1.8" fill="currentColor" />
          <path d="M11 22 C 14 27, 22 27, 25 22" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-14 bottom-4 text-white/50 text-xs font-mono pointer-events-none hidden sm:block"
      >
        + o .
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [12, -12, 12] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute -right-12 bottom-2 text-yellow-400 text-2xl pointer-events-none hidden sm:block"
      >
        ✦
      </motion.div>

      {/* Projector Flicker Container */}
      <motion.div
        animate={{ opacity: [0.93, 1, 0.9, 0.98, 1, 0.92, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
      >
        {/* Purple Neon Outer Countdown Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-[#A855F7] shadow-[0_0_35px_rgba(168,85,247,0.7)] pointer-events-none"
        />

        {/* Inner Target Crosshairs */}
        <div className="absolute inset-4 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-5 rounded-full border border-yellow-400/40" />

          {/* Rotating Radar Wiper Arm */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="absolute w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#A855F7] to-transparent origin-center shadow-[0_0_12px_#A855F7]"
          />
          <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#FFD600] to-transparent origin-center opacity-60" />
        </div>

        {/* Huge Hand-Painted Yellow Number (3 -> 2 -> 1 -> GO!) */}
        <motion.div
          key={count}
          initial={{ scale: 1.6, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotate: 6 }}
          transition={{ duration: 0.25, ease: 'backOut' }}
          className="relative z-10 text-8xl sm:text-9xl lg:text-[130px] font-black text-[#FFD600] font-handdrawn drop-shadow-[0_0_40px_rgba(255,214,0,0.75)]"
        >
          {count > 0 ? count : 'GO!'}
        </motion.div>

        {/* Vintage Film Camera Reel Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD600] text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg transform rotate-2">
          A24 // REEL #03
        </div>
      </motion.div>

      {/* Status Message & Yellow Brush Underline */}
      <div className="text-center space-y-2 pt-2">
        <p className="text-xl sm:text-2xl font-black uppercase tracking-widest text-white font-handdrawn">
          {statusMessage}
        </p>

        {/* Animated Hand-Drawn Yellow Brush Underline */}
        <svg className="w-52 h-4 text-[#FFD600] mx-auto" viewBox="0 0 160 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <motion.path
            d="M 2 6 C 40 1, 80 11, 120 4 C 140 1, 155 8, 158 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default MovieCountdownLoader;
