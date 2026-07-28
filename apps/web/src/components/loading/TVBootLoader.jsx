import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TVBootLoader = ({ statusMessage }) => {
  const [bootPhase, setBootPhase] = useState(0); // 0: off/scanline, 1: static noise, 2: play icon signal

  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase(1), 500);
    const t2 = setTimeout(() => setBootPhase(2), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 select-none font-handdrawn w-full max-w-[520px]">
      {/* Floating Doodles */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-10 -top-8 text-cyan-400 text-xs font-mono pointer-events-none hidden sm:block"
      >
        \ /
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4], rotate: [6, -6, 6] }}
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
        className="absolute -right-10 bottom-10 text-yellow-400 text-2xl pointer-events-none hidden sm:block"
      >
        ✦
      </motion.div>

      {/* Centered Retro CRT TV Container */}
      <div className="relative w-60 h-48 sm:w-72 sm:h-56 flex items-center justify-center">
        {/* Antennas */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-8 pointer-events-none">
          <svg className="w-full h-full text-cyan-400" viewBox="0 0 40 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="20" y1="24" x2="4" y2="4" />
            <line x1="20" y1="24" x2="36" y2="4" />
          </svg>
        </div>

        {/* CRT TV Outer Casing with Soft Neon Glow */}
        <div className="relative w-full h-full bg-[#111522] border-4 border-cyan-400/90 rounded-2xl p-3 shadow-[0_0_35px_rgba(6,182,212,0.45)] flex items-center justify-between">
          
          {/* Glowing CRT Screen with Power-On Sequential Animation */}
          <div className="relative w-[78%] h-full bg-[#070B17] rounded-xl border border-cyan-400/50 overflow-hidden flex flex-col items-center justify-center">
            
            {/* Phase 0: Horizontal Scanline (TV Off / Turn On) */}
            {bootPhase === 0 && (
              <motion.div
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-[2.5px] bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]"
              />
            )}

            {/* Phase 1 & 2: CRT Static Noise Lines */}
            {bootPhase >= 1 && (
              <motion.div
                animate={{ y: [-30, 30] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent opacity-70 pointer-events-none"
              />
            )}

            {/* Phase 2: Watch Party Play Icon Signal Fades On Screen */}
            {bootPhase >= 2 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.95, 1.1, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
                className="relative z-10 flex flex-col items-center space-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B0E17] border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,214,0,0.6)] transform -rotate-2">
                  <svg className="w-6 h-6 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase font-handdrawn">
                  SIGNAL ON
                </span>
              </motion.div>
            )}
          </div>

          {/* TV Side Controls Knob & Buttons */}
          <div className="w-[18%] h-full flex flex-col items-center justify-around py-2">
            <div className="w-4 h-4 rounded-full border border-gray-500 bg-gray-800" />
            <div className="w-4 h-4 rounded-full border border-gray-500 bg-gray-800" />
            <div className="w-5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
          </div>
        </div>
      </div>

      {/* Status Message & Soft Brush Progress Bar */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-xl sm:text-2xl font-black uppercase tracking-wider text-cyan-300">
          {statusMessage || "Turning on the TV..."}
        </p>

        {/* Soft Brush-Style Progress Bar (Cyan → Purple → Yellow Gradient) */}
        <div className="relative w-56 sm:w-64 h-5 bg-[#111522] rounded-full border-2 border-cyan-400/30 p-1 flex items-center overflow-hidden shadow-inner mx-auto">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FFD600] rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};

export default TVBootLoader;
