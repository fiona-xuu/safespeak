import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSafeSpeak } from '@/contexts/SafeSpeakContext';
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { sendAudioToLLM } from "../../src/services/llm";

// Asset Constants from Figma
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/3879cbdb-56fd-4594-a25d-bc1b70827f45";

export default function VoiceScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { status, setStatus } = useSafeSpeak();

  // Refs for safe cleanup
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

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

    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch((error) => {
          // Ignore "already unloaded" errors
          if (!error.message?.includes('already been unloaded')) {
            console.error('Error cleaning up recording:', error);
          }
        });
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((error) => {
          // Ignore "already unloaded" errors
          if (!error.message?.includes('already been unloaded')) {
            console.error('Error cleaning up sound:', error);
          }
        });
      }
    };
  }, []);

  async function recordAndProcess() {
    try {
      // Set status to indicate features have been used
      setStatus('has_used_features');

      // Stop any existing recording first
      if (recording) {
        console.log('Stopping existing recording...');
        await recording.stopAndUnloadAsync().catch((error) => {
          // Ignore "already unloaded" errors
          if (!error.message?.includes('already been unloaded')) {
            console.error('Error stopping existing recording:', error);
          }
        });
        setRecording(null);
        recordingRef.current = null;
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
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      recordingRef.current = newRecording;
      setIsRecording(true);
      console.log('Recording started for 3 seconds...');

      // Record for 3 seconds then automatically stop and process
      setTimeout(async () => {
        if (!newRecording) return;

        try {
          console.log('Auto-stopping recording after 3 seconds...');
          await newRecording.stopAndUnloadAsync();
          const uri = newRecording.getURI();
          setRecording(null);
          recordingRef.current = null;
          setIsRecording(false);

          if (uri) {
            console.log('Processing audio with AI...');
            setLoading(true);
            setResponse(null);

            try {
              const result = await sendAudioToLLM(uri);
              console.log('AI response received:', result);

              if (result && typeof result === 'object' && result.textResponse) {
                setResponse(result.textResponse);

                // Auto-play the AI audio response if available
                if (result.audioResponse) {
                  await playAiResponse(result.audioResponse);
                }
              } else {
                setResponse('Sorry, I couldn\'t process that response.');
              }
            } catch (error) {
              console.error('Error processing audio:', error);
              setResponse(`Sorry, there was an error processing your audio: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('Error auto-stopping recording:', error);
          setIsRecording(false);
          Alert.alert('Recording Error', 'Could not stop recording properly.');
        }
      }, 3000); // 3 seconds

    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
      setIsRecording(false);
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
      soundRef.current = responseSound;

      responseSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          responseSound.unloadAsync();
          setSound(null);
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.error('Error playing AI response:', error);
    }
  }

  const handleRecordPress = () => {
    if (!isRecording && !loading) {
      recordAndProcess();
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        {isRecording ? "Recording..." : "Press to Record Live"}
      </Text>

      {/* Record Button Container */}
      <View style={styles.recordContainer}>
        <TouchableOpacity 
          onPress={handleRecordPress}
          activeOpacity={0.8}
          style={styles.recordButtonWrapper}
        >
          {/* Background Ellipse (Native View for reliability) */}
          <View style={styles.recordButtonCircle} />
          
          {/* Voice Icon */}
          <View style={styles.iconContainer}>
             <IconSymbol 
              name="mic.fill" 
              size={60} 
              color={isRecording ? "#ff4444" : "#FFAFCD"}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Mascot Image - Hide during processing */}
      {!loading && (
        <View style={styles.mascotContainer}>
          <Image
            source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>
      )}

      {/* AI Response Display */}
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>AI Response:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAFCD" />
          <Text style={styles.loadingText}>Processing your voice...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    position: 'absolute',
    top: 156,
    textAlign: 'center',
    width: '100%',
  },
  recordContainer: {
    position: 'absolute',
    top: 295,
    width: 129,
    height: 129,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonWrapper: {
    width: 129,
    height: 129,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonCircle: {
    position: 'absolute',
    width: 129,
    height: 129,
    borderRadius: 64.5,
    backgroundColor: '#ffffff', // White
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    zIndex: 1,
  },
  mascotContainer: {
    position: 'absolute',
    left: 23,
    top: 400,
    width: 350,
    height: 374,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  responseContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFAFCD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
