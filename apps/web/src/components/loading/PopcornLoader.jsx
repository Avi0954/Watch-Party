import React from 'react';
import { motion } from 'framer-motion';

const PopcornLoader = ({ statusMessage }) => {
  const kernels = [
    { id: 1, x: -36, y: -75, delay: 0.1, rotate: -20 },
    { id: 2, x: -12, y: -95, delay: 0.25, rotate: 15 },
    { id: 3, x: 14, y: -85, delay: 0.4, rotate: 30 },
    { id: 4, x: 38, y: -70, delay: 0.55, rotate: -25 },
    { id: 5, x: 0, y: -105, delay: 0.7, rotate: 10 }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 select-none font-handdrawn w-full max-w-[500px]">
      {/* Floating Doodles Around Scene */}
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [-8, 8, -8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-10 -top-8 text-yellow-400 text-2xl pointer-events-none hidden sm:block"
      >
        ✦
      </motion.div>

      <motion.div
        animate={{ y: [5, -5, 5], rotate: [6, -6, 6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-8 -top-6 text-purple-400 opacity-80 pointer-events-none hidden sm:block"
      >
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="18" cy="18" r="15" />
          <circle cx="12" cy="14" r="1.8" fill="currentColor" />
          <circle cx="24" cy="14" r="1.8" fill="currentColor" />
          <path d="M11 22 C 14 27, 22 27, 25 22" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute -right-10 bottom-12 text-pink-400 text-xl pointer-events-none hidden sm:block"
      >
        ✨
      </motion.div>

      {/* Giant Illustrated Popcorn Bucket & Popping Kernels Container */}
      <div className="relative w-48 h-56 sm:w-56 sm:h-64 flex items-end justify-center">
        {/* Popping Popcorn Kernels */}
        {kernels.map((k) => (
          <motion.div
            key={k.id}
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{
              y: [0, k.y, 0],
              x: [0, k.x, 0],
              opacity: [0, 1, 0],
              scale: [0.6, 1.3, 0.8],
              rotate: [0, k.rotate, k.rotate * 2]
            }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              delay: k.delay,
              ease: 'easeOut'
            }}
            className="absolute bottom-36 w-9 h-9 rounded-full bg-[#FFD600] border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,214,0,0.7)] z-20"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-100" />
          </motion.div>
        ))}

        {/* Giant Popcorn Bucket Body */}
        <div className="relative w-36 h-40 sm:w-44 sm:h-48 bg-gradient-to-b from-red-600 to-red-700 rounded-b-2xl border-3 border-white/40 shadow-[0_20px_45px_rgba(239,68,68,0.4)] overflow-hidden flex items-center justify-center z-10 transform -rotate-1">
          {/* Vertical Red & White Stripes */}
          <div className="absolute inset-0 flex justify-between px-3 pointer-events-none">
            <div className="w-5 h-full bg-white/90" />
            <div className="w-5 h-full bg-white/90" />
            <div className="w-5 h-full bg-white/90" />
          </div>

          {/* Hand-Drawn Yellow Emblem Badge */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-[#FFD600] border-2 border-black flex flex-col items-center justify-center shadow-lg transform rotate-3">
            <span className="text-[10px] font-black uppercase text-black tracking-widest">EXTRA</span>
            <span className="text-xs font-black uppercase text-black tracking-tighter">BUTTER</span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
          {statusMessage || "Making popcorn..."}
        </p>

        {/* Brush-Style Loading Bar (Purple → Pink → Cyan Gradient) */}
        <div className="relative w-56 sm:w-64 h-5 bg-[#111522] rounded-full border-2 border-white/20 p-1 flex items-center overflow-hidden shadow-inner mx-auto">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#00E5FF] rounded-full shadow-[0_0_12px_rgba(236,72,153,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};

export default PopcornLoader;
