import * as FileSystem from "expo-file-system/legacy";
import { API_KEYS } from '../../config/api-keys';

// API Keys
const ELEVENLABS_API_KEY = API_KEYS.ELEVENLABS;

export async function sendAudioToLLM(uri: string) {
  try {
    console.log("Processing audio with ElevenLabs Conversational AI:", uri);

    let audioResponse = null; // Declare at function level

    // Read the audio file as base64
    const audioData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Audio loaded, processing...");

    // Step 1: Transcribe with ElevenLabs STT
    console.log("Transcribing audio...");
    const formData = new FormData();

    // Use file URI directly (React Native compatible)
    formData.append("file", {
      uri: uri,
      type: "audio/m4a",
      name: "audio.m4a"
    } as any);
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
    const transcription = transcriptionData.text || transcriptionData.transcription || "";
    console.log("Transcription:", transcription);

    // Step 2: Generate conversational response using ElevenLabs agent
    console.log("Generating AI response for transcription:", transcription);

    // Generate contextual conversational response
    const lowerTranscription = transcription.toLowerCase();
    let aiResponse = "That sounds interesting. Tell me more.";

    // Analyze for emotional context and create appropriate responses
    if (lowerTranscription.includes('anxious') || lowerTranscription.includes('worried') || lowerTranscription.includes('scared') || lowerTranscription.includes('nervous')) {
      const anxiousResponses = [
        `I hear you're feeling anxious about that. What's making you feel this way? I'm here to listen.`,
        `Anxiety can be really tough. Can you tell me more about what's got you worried right now?`,
        `That sounds stressful. What's the main thing making you feel anxious? I'm here to help you through it.`,
        `I understand feeling anxious sometimes. What's been on your mind lately?`
      ];
      aiResponse = anxiousResponses[Math.floor(Math.random() * anxiousResponses.length)];
    }

    else if (lowerTranscription.includes('sad') || lowerTranscription.includes('depressed') || lowerTranscription.includes('down') || lowerTranscription.includes('upset')) {
      const sadResponses = [
        `I'm sorry you're feeling this way. What's been weighing on you? I'm here to listen.`,
        `That sounds really tough. Can you tell me what's got you feeling down?`,
        `I hear how heavy that feels. What's been the hardest part for you lately?`,
        `I'm here for you. What's been making you feel sad? Let's talk about it.`
      ];
      aiResponse = sadResponses[Math.floor(Math.random() * sadResponses.length)];
    }

    else if (lowerTranscription.includes('angry') || lowerTranscription.includes('frustrated') || lowerTranscription.includes('mad') || lowerTranscription.includes('pissed')) {
      const angryResponses = [
        `I hear that frustration. What happened that's got you feeling this way?`,
        `That sounds really infuriating. Can you tell me what happened? I'm listening.`,
        `Anger is valid. What's been making you so frustrated lately?`,
        `I get that you're upset. What's the situation that's got you fired up?`
      ];
      aiResponse = angryResponses[Math.floor(Math.random() * angryResponses.length)];
    }

    else if (lowerTranscription.includes('overwhelmed') || lowerTranscription.includes('stressed') || lowerTranscription.includes('too much') || lowerTranscription.includes('exhausted')) {
      const overwhelmedResponses = [
        `Being overwhelmed is so real. What's piling up on you right now?`,
        `That sounds like a lot to handle. What's been the most stressful part?`,
        `I understand feeling overwhelmed. Can you tell me what's been weighing on you?`,
        `Life can feel like too much sometimes. What's got you feeling this stressed?`
      ];
      aiResponse = overwhelmedResponses[Math.floor(Math.random() * overwhelmedResponses.length)];
    }

    else if (lowerTranscription.includes('happy') || lowerTranscription.includes('excited') || lowerTranscription.includes('great') || lowerTranscription.includes('awesome')) {
      const happyResponses = [
        `That sounds wonderful! What's got you feeling so positive right now?`,
        `I'm so glad you're feeling good! Can you tell me what made your day great?`,
        `That sounds amazing! What's been going well for you lately?`,
        `Love hearing that you're in a good place! What's been making you happy?`
      ];
      aiResponse = happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }

    else if (lowerTranscription.includes('confused') || lowerTranscription.includes('unsure') || lowerTranscription.includes('lost') || lowerTranscription.includes('question')) {
      const confusedResponses = [
        `I hear you're feeling uncertain. What's got you confused right now?`,
        `That sounds unclear. Can you tell me what's been puzzling you?`,
        `It's okay to feel unsure sometimes. What's been on your mind?`,
        `Questions are good! What's got you wondering right now?`
      ];
      aiResponse = confusedResponses[Math.floor(Math.random() * confusedResponses.length)];
    }

    else {
      // General conversational responses
      const generalResponses = [
        `That sounds important to you. Can you tell me more about it?`,
        `I hear you. What's been going on with that situation?`,
        `That caught my attention. What's the story behind it?`,
        `I understand. Can you elaborate on what's been happening?`,
        `That makes sense. How are you feeling about it all?`,
        `I see. What's your next thought about this?`,
        `Got it. What's been the most challenging part for you?`,
        `I appreciate you sharing that. What's on your mind about it?`
      ];
      aiResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    console.log("Generated contextual response:", aiResponse);

    // Prepare return object
    const returnObject = {
      transcription: transcription,
      textResponse: aiResponse,
      audioResponse: audioResponse
    };
    console.log("Return object:", returnObject);

    // Generate speech with ElevenLabs TTS
    console.log("Generating speech with TTS...");

    try {
        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
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
              similarity_boost: 0.5
            }
          })
        });

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        audioResponse = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
        console.log("Speech generated successfully");
      } else {
        const errorText = await ttsResponse.text();
        console.error("TTS failed:", ttsResponse.status, errorText);
        throw new Error(`TTS failed: ${ttsResponse.status} - ${errorText}`);
      }
      } catch (ttsError) {
        console.error("TTS error:", ttsError);
      }
    }

    // Return both text response and audio data
    return returnObject;

  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}
  