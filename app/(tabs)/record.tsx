import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { sendAudioToLLM } from "../../src/services/llm";

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check if there's a recording on mount
  useEffect(() => {
    checkForRecording();
  }, []);

  // Cleanup sounds on unmount or when sounds change
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  async function playAiResponse(audioBase64: string) {
    try {
      // Convert base64 to audio URI
      const audioUri = `data:audio/mpeg;base64,${audioBase64}`;

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound: responseSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setIsPlayingResponse(true);

      responseSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingResponse(false);
          responseSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing AI response:", error);
      setIsPlayingResponse(false);
    }
  }

  async function checkForRecording() {
    const exists = await hasMostRecentRecording();
    setHasRecording(exists);
  }

  async function handlePress() {
    if (!isRecording) {
      // Stop any currently playing audio
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
      
      await startRecording();
      setIsRecording(true);
      setHasRecording(false); // New recording in progress
    } else {
      const uri = await stopRecording();
      setIsRecording(false);

      if (uri) {
        setHasRecording(true);
        setLoading(true);
        setResponse(null); // Clear previous response
        try {
          console.log("Sending audio to LLM, URI:", uri);
          const result = await sendAudioToLLM(uri);
          console.log("Received response from LLM:", result);

          // Handle new response format
          if (typeof result === 'object' && result.textResponse) {
            setResponse(result.textResponse);
            if (result.audioResponse) {
              setAiResponseAudio(result.audioResponse);
              // Auto-play the AI response
              playAiResponse(result.audioResponse);
            }
          } else {
            // Fallback for old format
            setResponse(result as string);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          setResponse(`Sorry, there was an error processing your audio: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      }
    }
  }

  async function handlePlayRecording() {
    if (isPlaying && sound) {
      // Stop if currently playing
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      return;
    }

    try {
      // Check if recording exists first
      const exists = await hasMostRecentRecording();
      if (!exists) {
        alert("No recording available to play");
        return;
      }

      const uri = getMostRecentRecordingUri();
      if (!uri) {
        alert("No recording available to play");
        return;
      }

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound: playbackSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setSound(playbackSound);
      setIsPlaying(true);

      playbackSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          playbackSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing recording:", error);
      alert("Error playing recording");
    }
  }

  // Request microphone permissions and cleanup on mount/unmount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Microphone Permission Required', 'Please grant microphone permission to use voice features.');
        }
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
      }
    })();

    // Cleanup function
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  async function startRecordingSession() {
    try {
      // Stop any existing recording first
      if (recording) {
        console.log('Stopping existing recording...');
        await recording.stopAndUnloadAsync().catch(console.error);
        setRecording(null);
        setIsRecording(false);
      }

      console.log('Requesting recording permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Microphone Permission Required', 'Please grant microphone permission to record audio.');
        return;
      }

      console.log('Setting audio mode for recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Creating recording object...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  }

  async function stopRecordingAndProcess() {
    if (!recording || !isRecording) return;

    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        console.log('Processing audio with AI...');
        setLoading(true);
        setResponse(null);

        try {
          const result = await sendAudioToLLM(uri);
          console.log('AI response received:', result);
          console.log('Result type:', typeof result);
          console.log('Has textResponse:', result && typeof result === 'object' && 'textResponse' in result);
          console.log('Has audioResponse:', result && typeof result === 'object' && 'audioResponse' in result);

          if (result && typeof result === 'object' && result.textResponse) {
            setResponse(result.textResponse);

            // Auto-play the AI audio response if available
            if (result.audioResponse) {
              await playAiResponse(result.audioResponse);
            }
          } else {
            setResponse(result as string);
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          console.error('Error details:', error instanceof Error ? error.message : String(error));
          setResponse(`Sorry, there was an error processing your audio: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', 'Could not stop recording properly.');
    }
  }

  async function playAiResponse(audioBase64: string) {
    try {
      console.log('Playing AI response...');
      const audioUri = `data:audio/mpeg;base64,${audioBase64}`;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound: responseSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(responseSound);
      setIsPlaying(true);

      responseSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          responseSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error('Error playing AI response:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeSpeak - AI Voice Assistant</Text>

      <Text style={styles.instructions}>
        Tap and hold the microphone to record your message, then release to send it to the AI.
      </Text>

      {/* Voice Recording Interface */}
      <View style={styles.voiceInterface}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recording]}
          onPressIn={startRecordingSession}
          onPressOut={stopRecordingAndProcess}
          disabled={loading}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '🎤 Recording...' : '🎤 Hold to Record'}
          </Text>
        </TouchableOpacity>

        {response && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>AI Response:</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}
      </View>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {/* Keep the old UI as backup for now */}
      {false && (
        <>
          <Button
            title={isRecording ? "Stop Recording" : "Start Recording"}
            onPress={handlePress}
            disabled={loading}
          />

          {hasRecording && !isRecording && (
            <Button
              title={isPlaying ? "Stop Playback" : "Play Most Recent Recording"}
              onPress={handlePlayRecording}
              disabled={loading}
            />
          )}

          {aiResponseAudio && (
            <Button
              title={isPlayingResponse ? "Stop AI Response" : "Replay AI Response"}
              onPress={() => playAiResponse(aiResponseAudio)}
              disabled={loading}
            />
          )}

          {loading && <ActivityIndicator size="large" style={styles.loader} />}

          {response && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>AI Response:</Text>
              <Text style={styles.responseText}>{response}</Text>
              {aiResponseAudio && (
                <Text style={styles.audioNote}>🎵 AI response will be spoken automatically</Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  instructions: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  voiceInterface: {
    alignItems: "center",
    width: "100%",
  },
  recordButton: {
    backgroundColor: "#007AFF",
    borderRadius: 75,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
  },
  recording: {
    backgroundColor: "#FF3B30",
    transform: [{ scale: 1.1 }],
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  responseContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    maxWidth: 350,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
});

