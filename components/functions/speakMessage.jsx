import Tts from 'react-native-tts';

export const speakMessage = message => {
  Tts.getInitStatus().then(() => {
    Tts.speak(message);
  });
  Tts.stop();
};
export const soundSettings = () => {
  Tts.setDucking(true);
  Tts.setDefaultLanguage('hin-IN');
  Tts.setDefaultVoice('hi-in-x-hie-local'); // male // Tts.setDefaultVoice('hi-in-x-hia-local'); // slow female
};

