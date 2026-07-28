export const getRandomDuration = () => {
  // Random duration between 1500ms and 2000ms (1.5 to 2.0 seconds)
  return Math.floor(Math.random() * (2000 - 1500 + 1)) + 1500;
};

export const STORAGE_KEY = 'watch_party_last_loader_index';

export const getNextLoaderIndex = (totalLoaders = 6) => {
  let prevIndex = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      prevIndex = parseInt(stored, 10);
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }

  let nextIndex = Math.floor(Math.random() * totalLoaders);

  // Reroll if it matches previous index to prevent consecutive repetition
  if (prevIndex !== null && totalLoaders > 1) {
    while (nextIndex === prevIndex) {
      nextIndex = Math.floor(Math.random() * totalLoaders);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, nextIndex.toString());
  } catch (e) {
    console.warn('localStorage write error:', e);
  }

  return nextIndex;
};
