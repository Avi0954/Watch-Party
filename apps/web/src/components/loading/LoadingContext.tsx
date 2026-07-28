import React, { createContext, useContext } from 'react';
import { LoadingContextState } from '../../types/loading';

const defaultState: LoadingContextState = {
  isLoading: true,
  activeLoaderId: 'movie_countdown',
  activeLoaderName: 'Movie Countdown',
  statusMessage: '',
  isReducedMotion: false
};

export const LoadingContext = createContext<LoadingContextState>(defaultState);

export const useLoading = (): LoadingContextState => {
  return useContext(LoadingContext);
};
