import { LOADING_STORAGE_KEYS, CURRENT_LOADING_VERSION } from './constants';
import { LoaderId } from '../types/loading';

export const getStoredVersion = (): string | null => {
  try {
    return localStorage.getItem(LOADING_STORAGE_KEYS.VERSION);
  } catch (e) {
    console.warn('[LoadingStorage] Failed to read version from localStorage:', e);
    return null;
  }
};

export const setStoredVersion = (version: string = CURRENT_LOADING_VERSION): void => {
  try {
    localStorage.setItem(LOADING_STORAGE_KEYS.VERSION, version);
  } catch (e) {
    console.warn('[LoadingStorage] Failed to set version in localStorage:', e);
  }
};

export const getStoredQueue = (): LoaderId[] | null => {
  try {
    const version = getStoredVersion();
    if (version !== CURRENT_LOADING_VERSION) {
      // Invalidate old queues when version changes
      clearStoredLoadingData();
      setStoredVersion(CURRENT_LOADING_VERSION);
      return null;
    }

    const raw = localStorage.getItem(LOADING_STORAGE_KEYS.QUEUE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as LoaderId[]) : null;
  } catch (e) {
    console.warn('[LoadingStorage] Failed to read queue from localStorage:', e);
    return null;
  }
};

export const setStoredQueue = (queue: LoaderId[]): void => {
  try {
    localStorage.setItem(LOADING_STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    setStoredVersion(CURRENT_LOADING_VERSION);
  } catch (e) {
    console.warn('[LoadingStorage] Failed to set queue in localStorage:', e);
  }
};

export const getStoredLastShown = (): LoaderId | null => {
  try {
    return localStorage.getItem(LOADING_STORAGE_KEYS.LAST) as LoaderId | null;
  } catch (e) {
    console.warn('[LoadingStorage] Failed to read lastShown from localStorage:', e);
    return null;
  }
};

export const setStoredLastShown = (loaderId: LoaderId): void => {
  try {
    localStorage.setItem(LOADING_STORAGE_KEYS.LAST, loaderId);
  } catch (e) {
    console.warn('[LoadingStorage] Failed to set lastShown in localStorage:', e);
  }
};

export const clearStoredLoadingData = (): void => {
  try {
    localStorage.removeItem(LOADING_STORAGE_KEYS.QUEUE);
    localStorage.removeItem(LOADING_STORAGE_KEYS.LAST);
  } catch (e) {
    console.warn('[LoadingStorage] Failed to clear loading data:', e);
  }
};
