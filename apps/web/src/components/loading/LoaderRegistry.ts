import { LoaderMetadata, LoaderId } from '../../types/loading';
import { PER_LOADER_MESSAGES } from '../../utils/messages';
import MovieCountdown from './screens/MovieCountdown';
import Popcorn from './screens/Popcorn';
import TVBoot from './screens/TVBoot';
import Friends from './screens/Friends';
import Arcade from './screens/Arcade';
import Notebook from './screens/Notebook';

export const LOADER_REGISTRY: Record<LoaderId, LoaderMetadata> = {
  movie_countdown: {
    id: 'movie_countdown',
    name: 'Movie Countdown',
    weight: 1,
    minDurationMs: 2600,
    maxDurationMs: 3400,
    messages: PER_LOADER_MESSAGES.movie_countdown,
    component: MovieCountdown
  },
  popcorn: {
    id: 'popcorn',
    name: 'Popcorn Loading',
    weight: 1,
    minDurationMs: 2200,
    maxDurationMs: 3200,
    messages: PER_LOADER_MESSAGES.popcorn,
    component: Popcorn
  },
  tv_boot: {
    id: 'tv_boot',
    name: 'TV Boot',
    weight: 1,
    minDurationMs: 2400,
    maxDurationMs: 3300,
    messages: PER_LOADER_MESSAGES.tv_boot,
    component: TVBoot
  },
  notebook: {
    id: 'notebook',
    name: 'Notebook',
    weight: 1,
    minDurationMs: 2200,
    maxDurationMs: 3000,
    messages: PER_LOADER_MESSAGES.notebook,
    component: Notebook
  },
  friends: {
    id: 'friends',
    name: 'Friends Joining',
    weight: 1,
    minDurationMs: 2400,
    maxDurationMs: 3100,
    messages: PER_LOADER_MESSAGES.friends,
    component: Friends
  },
  arcade: {
    id: 'arcade',
    name: 'Neon Arcade',
    weight: 1,
    minDurationMs: 2500,
    maxDurationMs: 3500,
    messages: PER_LOADER_MESSAGES.arcade,
    component: Arcade
  }
};

export const ALL_LOADER_IDS: LoaderId[] = [
  'movie_countdown',
  'popcorn',
  'tv_boot',
  'notebook',
  'friends',
  'arcade'
];

export const getLoaderMetadata = (id: LoaderId): LoaderMetadata => {
  return LOADER_REGISTRY[id] || LOADER_REGISTRY.movie_countdown;
};
