export const LOADER_MESSAGES = [
  "Turning on the TV...",
  "Tuning into the fun...",
  "Finding your friends...",
  "Connecting everyone...",
  "Making popcorn...",
  "Adding extra butter...",
  "Movie snacks incoming...",
  "Almost snack time...",
  "Charging good vibes...",
  "Creating watch party...",
  "Rolling projector...",
  "Movie magic loading..."
];

export const getRandomMessage = () => {
  const index = Math.floor(Math.random() * LOADER_MESSAGES.length);
  return LOADER_MESSAGES[index];
};
