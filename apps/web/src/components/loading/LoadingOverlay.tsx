import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Logo';
import { LoaderMetadata } from '../../types/loading';

interface LoadingOverlayProps {
  isLoading: boolean;
  activeLoader: LoaderMetadata;
  statusMessage: string;
  isReducedMotion: boolean;
}

const EASE_CUBIC_OUT = [0.22, 1, 0.36, 1] as const;

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  activeLoader,
  statusMessage,
  isReducedMotion
}) => {
  const ScreenComponent = activeLoader.component;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-overlay"
          initial={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            filter: 'blur(6px)',
            transition: {
              duration: isReducedMotion ? 0.2 : 0.6,
              ease: EASE_CUBIC_OUT
            }
          }}
          className="fixed inset-0 z-50 bg-[#070B17] text-white flex flex-col items-center justify-center p-4 overflow-hidden font-sans select-none"
        >
          {/* Layer 1: Background Radial Glows (Fades First) */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE_CUBIC_OUT } }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/[0.04] blur-[140px] rounded-full" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/[0.04] blur-[120px] rounded-full" />
          </motion.div>

          {/* Layer 2: Logo Badge (Fades Last) */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.55, delay: 0.1, ease: EASE_CUBIC_OUT } }}
            className="absolute top-6 sm:top-8 left-6 sm:left-10 z-50"
          >
            <Logo />
          </motion.div>

          {/* Layer 3: Active Screen Component & Doodles (Staggered Exit) */}
          <motion.div
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.45, delay: 0.05, ease: EASE_CUBIC_OUT }
            }}
            className="relative z-10 my-auto"
          >
            <ScreenComponent statusMessage={statusMessage} isReducedMotion={isReducedMotion} />
          </motion.div>

          {/* Layer 4: Footer Tagline */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE_CUBIC_OUT } }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-handdrawn text-gray-400 uppercase tracking-widest pointer-events-none"
          >
            NO SIGNUP. JUST VIBES. ≡
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
