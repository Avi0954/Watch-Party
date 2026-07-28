import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LoaderId, LoadingContextState, AnalyticsEvent } from '../../types/loading';
import { ALL_LOADER_IDS, getLoaderMetadata } from './LoaderRegistry';
import { popNextLoaderId } from '../../utils/shuffle';
import { getRandomLoaderMessage } from '../../utils/messages';
import { LoadingContext } from './LoadingContext';
import { LoadingOverlay } from './LoadingOverlay';

interface LoadingManagerProps {
  children: ReactNode;
}

const EASE_CUBIC_OUT = [0.22, 1, 0.36, 1] as const;

class LoadingErrorBoundary extends React.Component<{ children: ReactNode; fallbackLoaderId: LoaderId }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallbackLoaderId: LoaderId }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[LoadingErrorBoundary] Loader component crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const fallbackLoader = getLoaderMetadata('movie_countdown');
      const FallbackComponent = fallbackLoader.component;
      return <FallbackComponent statusMessage="Movie magic loading..." isReducedMotion={false} />;
    }
    return this.props.children;
  }
}

export const LoadingManager: React.FC<LoadingManagerProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLoaderId, setActiveLoaderId] = useState<LoaderId>('movie_countdown');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    let nextId: LoaderId = 'movie_countdown';
    try {
      nextId = popNextLoaderId(ALL_LOADER_IDS);
    } catch (e) {
      console.warn('[LoadingManager] Failed to select loader from ShuffleBag, fallback to movie_countdown:', e);
    }

    setActiveLoaderId(nextId);

    const metadata = getLoaderMetadata(nextId);
    const msg = getRandomLoaderMessage(nextId);
    setStatusMessage(msg);

    const range = metadata.maxDurationMs - metadata.minDurationMs;
    const randomizedDuration = Math.floor(Math.random() * (range + 1)) + metadata.minDurationMs;

    const startAnalyticsEvent: AnalyticsEvent = {
      event: 'loading_started',
      loader_id: nextId,
      loader_name: metadata.name,
      timestamp: Date.now()
    };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('watchparty_analytics', { detail: startAnalyticsEvent }));
    }

    const preloadPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        const onLoad = () => {
          window.removeEventListener('load', onLoad);
          resolve();
        };
        window.addEventListener('load', onLoad);
        setTimeout(resolve, 1800);
      }
    });

    const timer = setTimeout(() => {
      preloadPromise.then(() => {
        setIsLoading(false);

        const finishDurationMs = Date.now() - startTime;
        const finishAnalyticsEvent: AnalyticsEvent = {
          event: 'loading_finished',
          loader_id: nextId,
          loader_name: metadata.name,
          loading_duration_ms: finishDurationMs,
          timestamp: Date.now()
        };
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('watchparty_analytics', { detail: finishAnalyticsEvent }));
        }
      });
    }, randomizedDuration);

    return () => clearTimeout(timer);
  }, [startTime]);

  const activeLoader = useMemo(() => getLoaderMetadata(activeLoaderId), [activeLoaderId]);

  const contextValue: LoadingContextState = useMemo(() => ({
    isLoading,
    activeLoaderId,
    activeLoaderName: activeLoader.name,
    statusMessage,
    isReducedMotion
  }), [isLoading, activeLoaderId, activeLoader.name, statusMessage, isReducedMotion]);

  return (
    <LoadingContext.Provider value={contextValue}>
      <LoadingErrorBoundary fallbackLoaderId={activeLoaderId}>
        <LoadingOverlay
          isLoading={isLoading}
          activeLoader={activeLoader}
          statusMessage={statusMessage}
          isReducedMotion={isReducedMotion}
        />
      </LoadingErrorBoundary>

      {/* Homepage Main Application Content with Cinematic Overlapping Entrance */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
          scale: 0.985
        }}
        animate={isLoading ? {
          opacity: 0,
          y: 12,
          scale: 0.985
        } : {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: isReducedMotion ? 0.3 : 0.7,
            delay: isReducedMotion ? 0.05 : 0.24,
            ease: EASE_CUBIC_OUT
          }
        }}
        className="w-full min-h-screen origin-center"
      >
        {children}
      </motion.div>
    </LoadingContext.Provider>
  );
};

export default LoadingManager;
