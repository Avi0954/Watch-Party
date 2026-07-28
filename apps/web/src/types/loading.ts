import React from 'react';

export type LoaderId = 'movie_countdown' | 'popcorn' | 'tv_boot' | 'friends' | 'arcade' | 'notebook';

export interface LoadingScreenProps {
  statusMessage: string;
  isReducedMotion?: boolean;
}

export interface LoaderMetadata {
  id: LoaderId;
  name: string;
  weight: number;
  minDurationMs: number;
  maxDurationMs: number;
  messages: string[];
  component: React.ComponentType<LoadingScreenProps>;
}

export interface AnalyticsEvent {
  event: 'loading_started' | 'loading_finished';
  loader_id: LoaderId;
  loader_name: string;
  loading_duration_ms?: number;
  timestamp: number;
}

export interface LoadingContextState {
  isLoading: boolean;
  activeLoaderId: LoaderId;
  activeLoaderName: string;
  statusMessage: string;
  isReducedMotion: boolean;
}
