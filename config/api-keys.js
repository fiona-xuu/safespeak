// API Keys Configuration
// We use process.env for web/node and fallback for React Native if env vars aren't bundled automatically.
// Ideally, use 'react-native-dotenv' or 'expo-constants' for secure env management.

export const API_KEYS = {
  ELEVENLABS: process.env.ELEVENLABS_API_KEY || 'sk_c3be172bbcb57634efc6e4987182e572e1ae6ff73b21786f',
  ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID || 'agent_3501kemv6dfrftnb081stpw1d4zv',
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID || 'TxGEqnHWrfWFTfGW9XjX',
  GEMINI: process.env.GEMINI_API_KEY || 'AIzaSyC2MJfOj-VvYzFc1L9Ljmxk9oX_gYn3eCk'  // not real api key
};
