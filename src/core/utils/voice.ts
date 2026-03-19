import * as Speech from 'expo-speech';

// Options for pacing and tone
const speechOptions = {
  rate: 0.95,
  pitch: 1.0,
};

export const speak = (text: string) => {
  // Stop existing speech to prevent overlapping queues
  Speech.stop().then(() => {
    Speech.speak(text, speechOptions);
  });
};

export const stopVoice = () => {
  Speech.stop();
};
