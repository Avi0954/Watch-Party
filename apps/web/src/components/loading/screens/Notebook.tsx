import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreenProps } from '../../../types/loading';

const CHECKLIST_ITEMS = [
  "Preparing videos",
  "Inviting friends",
  "Syncing playback",
  "Enabling chat",
  "Adding good vibes"
];

export const Notebook: React.FC<LoadingScreenProps> = ({ isReducedMotion = false }) => {
  const [checkedCount, setCheckedCount] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCheckedCount(1), 300);
    const t2 = setTimeout(() => setCheckedCount(2), 650);
    const t3 = setTimeout(() => setCheckedCount(3), 1000);
    const t4 = setTimeout(() => setCheckedCount(4), 1350);
    const t5 = setTimeout(() => setCheckedCount(5), 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 select-none font-handdrawn w-full max-w-[560px]">
      {/* Floating Doodles */}
      {!isReducedMotion && (
        <>
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-8, 8, -8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 -top-10 text-white/50 text-xs font-mono pointer-events-none hidden sm:block"
          >
            \ | /
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [12, -12, 12] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute -right-12 bottom-6 text-yellow-400 text-2xl pointer-events-none hidden sm:block"
          >
            ✦
          </motion.div>
        </>
      )}

      {/* Notebook Container */}
      <motion.div
        animate={isReducedMotion ? undefined : { rotate: [-1.2, 1.2, -1.2], y: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-72 sm:w-88 bg-[#111522] border-2 border-white/20 rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col space-y-4 overflow-hidden"
      >
        <div className="absolute top-2 inset-x-0 flex justify-between px-6 pointer-events-none">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-3 h-3.5 rounded-full border border-gray-400 bg-gray-800 shadow-inner" />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-base sm:text-lg font-black uppercase tracking-widest text-[#FFD600] font-handdrawn">
            PARTY CHECKLIST
          </span>
          <span className="text-xs font-mono text-purple-300 opacity-80">// READY</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = idx < checkedCount;
            return (
              <div key={item} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isChecked ? 'border-[#00E5FF] bg-[#00E5FF]/20 shadow-[0_0_10px_#00E5FF]' : 'border-white/30 bg-black/20'
                  }`}>
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'backOut' }}
                      className="w-4 h-4 text-[#00E5FF]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>

                <span className={`text-sm sm:text-base font-bold font-handdrawn transition-all duration-200 ${isChecked ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-gray-400'
                  }`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-1 text-right text-xs font-mono text-gray-500">
          PAGE 01 / 01
        </div>
      </motion.div>
    </div>
  );
};

export default Notebook;
