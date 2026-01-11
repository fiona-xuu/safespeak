import { Platform } from 'react-native';
import { API_KEYS } from '../../config/api-keys';

// API Keys
const ELEVENLABS_API_KEY = API_KEYS.ELEVENLABS;
const GEMINI_API_KEY = API_KEYS.GEMINI;

export interface LLMResponse {
  textResponse: string;
  audioResponse: string | null;
}

export async function sendAudioToLLM(uri: string): Promise<LLMResponse> {
  try {
    console.log("Processing audio with SafeSpeak & Gemini Brain...", uri);

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
      console.error("ElevenLabs STT failed:", transcriptionResponse.status, errorText);
      throw new Error(`Speech-to-text failed: ${transcriptionResponse.status} - ${errorText}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text || "";
    console.log("User said:", transcription);

    // Step 2: Generate Smart Response with Gemini 2.0 Flash
    console.log("Thinking (Gemini)...");
    let aiResponse = "I'm having a little trouble connecting, but I'm here with you.";

    try {
      const prompt = `
        You are SafeSpeak, a warm, empathetic, and supportive friend. You are having a casual spoken conversation with the user.
        
        Your Goal: Be a good friend—listen, chat, and offer comfort when needed.
        
        Guidelines:
        - **Be Casual:** Talk like a real friend. Use simple language, contractions (I'm, don't), and natural phrasing. Avoid sounding like a robot or a therapist.
        - **Be Concise:** Keep responses short (1-2 sentences mostly) so the conversation flows back and forth easily.
        - **Be Supportive:** If they are happy, be happy with them. If they are sad, be there for them.
        - **Safety First:** Only if the user mentions immediate danger or self-harm, gently advise them to call emergency services.
        
        User said: "${transcription}"
      `;

      // Direct REST API call to Gemini 2.0 Flash
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      console.log(geminiResponse);

      if (!geminiResponse.ok) {
        throw new Error(`Gemini failed: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiResponse = geminiData.candidates[0].content.parts[0].text;
      } else {
        console.warn("Unexpected Gemini response format:", geminiData);
        aiResponse = "I heard you, but I'm having trouble thinking of what to say right now.";
      }

    } catch (geminiError) {
      console.error("Gemini Brain Failed:", geminiError);
      // Fallback response remains set
    }

    console.log("AI Response:", aiResponse);

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
      textResponse: aiResponse,
      audioResponse: audioResponse
    };

  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}
  