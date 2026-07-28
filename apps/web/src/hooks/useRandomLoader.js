import { useState, useEffect } from 'react';
import { getNextLoaderIndex, getRandomDuration } from '../utils/loaderConfig';
import { getRandomMessage } from '../utils/loaderMessages';

export const useRandomLoader = (totalLoaders = 6) => {
  const [loaderIndex, setLoaderIndex] = useState(0);
  const [duration, setDuration] = useState(2500);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const selectedIndex = getNextLoaderIndex(totalLoaders);
    const selectedDuration = getRandomDuration();
    const selectedMessage = getRandomMessage();

    setLoaderIndex(selectedIndex);
    setDuration(selectedDuration);
    setStatusMessage(selectedMessage);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, selectedDuration);

    return () => clearTimeout(timer);
  }, [totalLoaders]);

  return {
    loaderIndex,
    duration,
    statusMessage,
    isLoading
  };
};

export default useRandomLoader;
