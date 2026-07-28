import { LoaderId } from '../types/loading';
import { LOADING_STORAGE_KEYS } from './constants';

export const PER_LOADER_MESSAGES: Record<LoaderId, string[]> = {
  movie_countdown: [
    "Rolling projector...",
    "Movie magic loading...",
    "Adjusting camera focus...",
    "Queuing reel #01...",
    "Dimming theater lights...",
    "Setting up wide screen...",
    "Preparing the feature film...",
    "Synchronizing audio reels...",
    "Popcorn ready, roll film...",
    "Almost showtime..."
  ],
  popcorn: [
    "Making popcorn...",
    "Adding extra butter...",
    "Movie snacks incoming...",
    "Almost snack time...",
    "Popping fresh kernels...",
    "Salting the bucket...",
    "Warming up the snacks...",
    "Grab your soda and seat...",
    "Delicious vibes loading...",
    "Snacks ready to serve..."
  ],
  tv_boot: [
    "Turning on the TV...",
    "Tuning into the fun...",
    "Finding your friends...",
    "Connecting everyone...",
    "Adjusting TV antennas...",
    "Warming up CRT tube...",
    "Clearing static noise...",
    "Locking on channel 07...",
    "HD signal acquired...",
    "Broadcast about to begin..."
  ],
  friends: [
    "Inviting your crew...",
    "Assembling the vibe team...",
    "Reserving seats for friends...",
    "Gathering the watch party...",
    "Connecting party avatars...",
    "Syncing friend presence...",
    "Waving hello to everyone...",
    "Party room is filling up...",
    "Good friends loading...",
    "Everyone is here!"
  ],
  arcade: [
    "Pressing start button...",
    "Loading 8-bit magic...",
    "Inserting virtual coin...",
    "High score loading...",
    "Powering arcade cabinet...",
    "Initializing stage 01...",
    "Calibrating joysticks...",
    "Unlocking achievement...",
    "Arcade vibes activated...",
    "Player 1 ready!"
  ],
  notebook: [
    "Preparing party checklist...",
    "Checking off items...",
    "Doodling good vibes...",
    "Syncing playback notes...",
    "Opening watch party notebook...",
    "Sharpening color pencils...",
    "Drawing the final touches...",
    "Sketching the room layout...",
    "Checklist 100% complete...",
    "Ready to party!"
  ]
};

export const getRandomLoaderMessage = (loaderId: LoaderId): string => {
  const messages = PER_LOADER_MESSAGES[loaderId] || PER_LOADER_MESSAGES.movie_countdown;
  
  let lastMessageIndex: number | null = null;
  try {
    const raw = localStorage.getItem(`${LOADING_STORAGE_KEYS.MESSAGES}_${loaderId}`);
    if (raw !== null) {
      lastMessageIndex = parseInt(raw, 10);
    }
  } catch (e) {
    console.warn('[LoadingMessages] Failed to read last message index:', e);
  }

  let nextIndex = Math.floor(Math.random() * messages.length);
  if (lastMessageIndex !== null && messages.length > 1) {
    while (nextIndex === lastMessageIndex) {
      nextIndex = Math.floor(Math.random() * messages.length);
    }
  }

  try {
    localStorage.setItem(`${LOADING_STORAGE_KEYS.MESSAGES}_${loaderId}`, nextIndex.toString());
  } catch (e) {
    console.warn('[LoadingMessages] Failed to write last message index:', e);
  }

  return messages[nextIndex];
};
