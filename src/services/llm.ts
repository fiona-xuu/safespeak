import { Platform } from 'react-native';
import { API_KEYS } from '../../config/api-keys';

// API Keys
const ELEVENLABS_API_KEY = API_KEYS.ELEVENLABS;

export async function sendAudioToLLM(uri: string) {
  try {
    console.log("Processing audio...", uri);

    // Step 1: Transcribe with ElevenLabs STT
    console.log("Transcribing audio...");
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("file", blob, "audio.m4a");
    } else {
      formData.append("file", {
        uri: uri,
        type: "audio/m4a",
        name: "audio.m4a"
      } as any);
    }

    formData.append("model_id", "scribe_v1");

    const transcriptionResponse = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      throw new Error(`Speech-to-text failed: ${transcriptionResponse.status} - ${errorText}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text || "";
    console.log("User said:", transcription);

    // Step 2: Determine Response (Without Gemini)
    // Note: The ElevenLabs Agent requires a WebSocket connection and streaming audio, 
    // which requires a native development build (not Expo Go).
    // Falling back to internal safety logic.
    console.log("Generating safety response...");
    
    let aiResponse = "I'm here with you. Tell me more.";
    const lowerText = transcription.toLowerCase();
    
    if (lowerText.includes("hello") || lowerText.includes("hi")) {
        aiResponse = "Hello! I am your SafeSpeak companion. I'm listening.";
    } 
    else if (lowerText.includes("help") || lowerText.includes("danger")) {
        aiResponse = "I am concerned for your safety. Please call emergency services or go to a public place.";
    } 
    else if (lowerText.includes("anxious") || lowerText.includes("scared")) {
        aiResponse = "It is okay to feel scared. Take a deep breath. I am right here.";
    }
    else if (lowerText.includes("sad") || lowerText.includes("alone")) {
        aiResponse = "You are not alone. I am here to keep you company.";
    }

    // Step 3: Generate Speech with ElevenLabs TTS
    console.log("Generating speech...");
    let audioResponse = null;

    try {
        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${API_KEYS.ELEVENLABS_VOICE_ID}`, {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: aiResponse,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        audioResponse = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      } else {
        console.error("TTS Failed:", await ttsResponse.text());
      }
    } catch (e) {
        console.error("TTS Network Error:", e);
    }

    return {
      transcription,
      textResponse: aiResponse,
      audioResponse
    };

  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}
