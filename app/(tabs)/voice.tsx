import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Asset Constants from Figma
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/3879cbdb-56fd-4594-a25d-bc1b70827f45";
const imgEllipse2 = "https://www.figma.com/api/mcp/asset/0afa55ac-e7a9-48d1-9f3c-4393d11da85c";

export default function VoiceScreen() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop the audio recording
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

      {/* Mascot Image */}
      <View style={styles.mascotContainer}>
        <Image 
          source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }} 
          style={styles.mascot} 
          resizeMode="contain"
        />
      </View>
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
    left: 108,
    top: 524,
    width: 177,
    height: 187,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
});
