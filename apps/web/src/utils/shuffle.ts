import { LoaderId } from '../types/loading';
import { getStoredQueue, setStoredQueue, getStoredLastShown, setStoredLastShown } from './storage';

/**
 * Fisher-Yates Shuffle Algorithm
 */
export const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Generate a new Shuffle Bag queue with anti-repetition guarantee across cycles.
 */
export const generateShuffledQueue = (allLoaderIds: LoaderId[], lastShown: LoaderId | null): LoaderId[] => {
  let newQueue = fisherYatesShuffle(allLoaderIds);

  // Anti-repeat rule: If the first item of the new queue matches the last shown loader from the previous cycle, swap it!
  if (lastShown && newQueue.length > 1 && newQueue[0] === lastShown) {
    const swapIndex = Math.floor(Math.random() * (newQueue.length - 1)) + 1;
    [newQueue[0], newQueue[swapIndex]] = [newQueue[swapIndex], newQueue[0]];
  }

  return newQueue;
};

/**
 * Pops the next loader ID from the Shuffle Bag.
 * Automatically regenerates and persists a new queue when empty.
 */
export const popNextLoaderId = (allLoaderIds: LoaderId[]): LoaderId => {
  let currentQueue = getStoredQueue();
  const lastShown = getStoredLastShown();

  if (!currentQueue || currentQueue.length === 0) {
    currentQueue = generateShuffledQueue(allLoaderIds, lastShown);
  }

  const nextLoaderId = currentQueue.shift() as LoaderId;

  // Save remaining queue and update lastShown in localStorage
  setStoredQueue(currentQueue);
  setStoredLastShown(nextLoaderId);

  return nextLoaderId;
};
