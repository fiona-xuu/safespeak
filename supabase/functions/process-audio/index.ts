import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    let base64Audio: string;
    let mimeType: string;

    if (contentType.includes("application/json")) {
      // Handle JSON request with base64 data
      const body = await req.json();
      base64Audio = body.audioData;
      mimeType = body.mimeType || "audio/m4a";

      if (!base64Audio) {
        return new Response(
          JSON.stringify({ error: "No audio data provided in request body" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      // Handle FormData request (for backwards compatibility)
      const formData = await req.formData();
      const audioFile = formData.get("file") as File;

      if (!audioFile) {
        return new Response(
          JSON.stringify({ error: "No audio file provided" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Convert audio file to base64
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      base64Audio = btoa(
        uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      mimeType = audioFile.type || "audio/m4a";
    }

    const elevenlabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenlabsApiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Processing audio, MIME type:", mimeType, "Base64 length:", base64Audio.length);

    // Convert base64 audio to blob for ElevenLabs API
    const audioBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: mimeType });

    // Step 1: Transcribe audio using ElevenLabs Speech-to-Text
    console.log("Transcribing audio with ElevenLabs...");
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.m4a");
    formData.append("model_id", "scribe_v1");

    const transcriptionResponse = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": elevenlabsApiKey,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error("ElevenLabs STT API error:", transcriptionResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to transcribe audio with ElevenLabs",
          details: errorText,
          status: transcriptionResponse.status
        }),
        { status: transcriptionResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text || transcriptionData.transcription || "";
    console.log("Transcription received:", transcription);

    // Step 2: Generate response using ElevenLabs Conversational AI (websocket approach)
    console.log("Generating response with ElevenLabs Conversational AI...");

    // For now, using their REST API for conversational response
    // Note: WebSocket would require a persistent connection from the client side
    const conversationResponse = await fetch("https://api.elevenlabs.io/v1/convai/conversation", {
      method: "POST",
      headers: {
        "xi-api-key": elevenlabsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_config_override: {
          agent: {
            prompt: {
              prompt: "You are SafeSpeak, a calm and supportive safety assistant. Please provide a helpful, supportive response to what was said. Keep your response empathetic and caring."
            },
            first_message: "I'm here to listen and support you. What would you like to talk about?",
            language: "en"
          }
        },
        user_input: transcription
      }),
    });

    if (!conversationResponse.ok) {
      const errorText = await conversationResponse.text();
      console.error("ElevenLabs Conversation API error:", conversationResponse.status, errorText);

      // Fallback: Just return the transcription if conversation API fails
      console.log("Falling back to transcription only");
      return new Response(
        JSON.stringify({
          response: `I heard you say: "${transcription}". I'm here to support you - please tell me more about what's on your mind.`
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const conversationData = await conversationResponse.json();
    const responseText = conversationData.response || `I heard you say: "${transcription}". I'm here to support you.`;
    
    if (!responseText) {
      console.error("No text in Gemini response:", JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ error: "No response text from Gemini API", details: geminiData }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Successfully processed audio, response length:", responseText.length);

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing audio:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
