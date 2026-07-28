export const LOADING_STORAGE_KEYS = {
  QUEUE: 'watchparty.loading.queue',
  LAST: 'watchparty.loading.last',
  VERSION: 'watchparty.loading.version',
  MESSAGES: 'watchparty.loading.last_messages'
} as const;

export const CURRENT_LOADING_VERSION = 'v1';

export const DEFAULT_FALLBACK_LOADER_ID = 'movie_countdown';
