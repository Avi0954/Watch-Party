import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreenProps } from '../../../types/loading';

export const Arcade: React.FC<LoadingScreenProps> = ({ statusMessage, isReducedMotion = false }) => {
  const [activeSegments, setActiveSegments] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSegments((prev) => (prev >= 8 ? 0 : prev + 1));
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 select-none font-handdrawn w-full max-w-[540px]">
      {/* Floating Doodles */}
      {!isReducedMotion && (
        <>
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 -top-8 text-[#00E5FF] text-2xl pointer-events-none hidden sm:block"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-10 -top-6 text-[#EC4899] text-xl pointer-events-none hidden sm:block"
          >
            ✨
          </motion.div>
        </>
      )}

      {/* Arcade Cabinet */}
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 bg-[#0B0E17] border-4 border-[#EC4899] rounded-3xl p-3 shadow-[0_0_40px_rgba(236,72,153,0.45)] flex flex-col justify-between overflow-hidden">
        <div className="absolute top-2 inset-x-3 flex justify-between px-2 pointer-events-none z-20">
          <motion.div animate={isReducedMotion ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-[#FFD600] shadow-[0_0_8px_#FFD600]" />
          <motion.div animate={isReducedMotion ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
          <motion.div animate={isReducedMotion ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shadow-[0_0_8px_#EC4899]" />
          <motion.div animate={isReducedMotion ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7]" />
        </div>

        <div className="mt-4 w-full bg-[#111522] border-2 border-[#FFD600] rounded-xl py-1.5 text-center shadow-[0_0_15px_rgba(255,214,0,0.5)] transform -rotate-1">
          <span className="text-sm sm:text-base font-black tracking-widest text-[#FFD600] uppercase font-mono drop-shadow-[0_0_8px_#FFD600]">
            WATCH PARTY
          </span>
        </div>

        <div className="relative w-full h-32 sm:h-36 bg-[#070B17] border-2 border-[#00E5FF] rounded-xl flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF] shadow-[0_0_12px_#00E5FF] mb-1">
            ▶
          </div>
          <motion.span
            animate={isReducedMotion ? undefined : { opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="text-xs sm:text-sm font-black tracking-widest text-[#00E5FF] uppercase font-mono drop-shadow-[0_0_10px_#00E5FF]"
          >
            PRESS START
          </motion.span>
        </div>

        <div className="w-full bg-[#111522] border-t-2 border-white/20 p-2.5 rounded-b-xl flex items-center justify-between">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-600" />
            <motion.div
              animate={isReducedMotion ? undefined : { rotate: [-15, 15, -15], x: [-3, 3, -3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 w-4 h-9 flex flex-col items-center origin-bottom"
            >
              <div className="w-5 h-5 rounded-full bg-[#EC4899] shadow-[0_0_10px_#EC4899]" />
              <div className="w-1.5 h-4 bg-gray-300" />
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div animate={isReducedMotion ? undefined : { scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-5 h-5 rounded-full bg-[#FFD600] border border-black shadow-[0_0_8px_#FFD600]" />
            <motion.div animate={isReducedMotion ? undefined : { scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-5 h-5 rounded-full bg-[#00E5FF] border border-black shadow-[0_0_8px_#00E5FF]" />
            <motion.div animate={isReducedMotion ? undefined : { scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-5 h-5 rounded-full bg-[#A855F7] border border-black shadow-[0_0_8px_#A855F7]" />
          </div>
        </div>
      </div>

      <div className="w-56 sm:w-64 space-y-2">
        <div className="flex items-center justify-between gap-1 p-1 bg-[#111522] border-2 border-purple-500/40 rounded-xl">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((segIndex) => {
            const isLit = segIndex <= activeSegments;
            const colors = ['bg-[#00E5FF]', 'bg-[#A855F7]', 'bg-[#EC4899]', 'bg-[#FFD600]'];
            const segColor = colors[segIndex % colors.length];

            return (
              <div
                key={segIndex}
                className={`flex-1 h-3.5 rounded-sm transition-all duration-150 ${isLit ? `${segColor} shadow-[0_0_8px_currentColor]` : 'bg-gray-800 opacity-40'
                  }`}
              />
            );
          })}
        </div>

        <p className="text-center text-lg sm:text-xl font-black uppercase tracking-wider text-[#EC4899]">
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default Arcade;
