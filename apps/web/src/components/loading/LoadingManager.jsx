import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRandomLoader from '../../hooks/useRandomLoader';
import Logo from '../Logo';
import MovieCountdownLoader from './MovieCountdownLoader';
import PopcornLoader from './PopcornLoader';
import TVBootLoader from './TVBootLoader';
import FriendsLoader from './FriendsLoader';
import ArcadeLoader from './ArcadeLoader';
import NotebookLoader from './NotebookLoader';

const LOADERS = [
  MovieCountdownLoader,
  PopcornLoader,
  TVBootLoader,
  FriendsLoader,
  ArcadeLoader,
  NotebookLoader
];

const LoadingManager = ({ children }) => {
  const { loaderIndex, statusMessage, isLoading } = useRandomLoader(LOADERS.length);
  const SelectedLoader = LOADERS[loaderIndex] || MovieCountdownLoader;

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-screen"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-[#070B17] text-white flex flex-col items-center justify-center p-4 overflow-hidden font-sans select-none"
          >
            {/* Background Subtle Radial Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/[0.04] blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/[0.04] blur-[120px] rounded-full pointer-events-none" />

            {/* Logo Badge Anchored to TOP LEFT */}
            <div className="absolute top-6 sm:top-8 left-6 sm:left-10 z-50">
              <Logo />
            </div>

            {/* Active Random Loader Scene (Centered) */}
            <div className="relative z-10 my-auto">
              <SelectedLoader statusMessage={statusMessage} />
            </div>

            {/* Subtle Footer Tagline */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-handdrawn text-gray-400 uppercase tracking-widest pointer-events-none">
              NO SIGNUP. JUST VIBES. ≡
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content with Smooth Fade-in (Direct transition without flash) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
};

export default LoadingManager;
