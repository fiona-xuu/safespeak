import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Asset Constants from Figma (Updated)
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/bb172f69-1565-42e7-915f-749b9f93153f";
const imgMaskGroup = "https://www.figma.com/api/mcp/asset/69c666a5-6ccc-4a34-b7e9-2e4b4028a242"; // The new hill with mask
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/a36d5b57-5982-4cfc-b289-7dc59abbef59";
const imgGroup18890 = "https://www.figma.com/api/mcp/asset/6d76fc09-a4c0-4bcb-aa75-06ce3a48972c";
const imgGroup18891 = "https://www.figma.com/api/mcp/asset/3b2a0518-a4f2-42e4-aa24-1bb34eb1046b";
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/5051b8ae-2837-4e00-9f08-66e3548bed88";
const imgEllipse204 = "https://www.figma.com/api/mcp/asset/50108afd-903a-422e-8bba-86fa7075f092";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Hill (Mask Group) */}
      <Image 
        source={{ uri: imgMaskGroup }} 
        style={styles.bgHill} 
        resizeMode="cover"
      />

      {/* Flowers on the hill - adjusted positions relative to bottom/hill */}
      <View style={styles.decorationsContainer}>
          <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 314, top: 219 }]} resizeMode="contain" />
          <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 211, top: 43 }]} resizeMode="contain" />
          <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 96, top: 139 }]} resizeMode="contain" />
          
          <Image source={{ uri: imgGroup18890 }} style={[styles.flower, { left: 267, top: 102 }]} resizeMode="contain" />
          <Image source={{ uri: imgGroup18891 }} style={[styles.flower, { left: 49, top: 66 }]} resizeMode="contain" />
          <Image source={{ uri: imgGroup18924 }} style={[styles.flower, { left: 184, top: 211 }]} resizeMode="contain" />
          
          <Image source={{ uri: imgGroup18924 }} style={[styles.sparkle, { left: 29, top: 238 }]} resizeMode="contain" />
          <Image source={{ uri: imgGroup18924 }} style={[styles.sparkle, { left: 332, top: 46 }]} resizeMode="contain" />
      </View>

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to SafeSpeak</Text>

      {/* Mascot Section */}
      <View style={styles.mascotContainer}>
        {/* Shadow under mascot */}
        <Image source={{ uri: imgEllipse204 }} style={styles.mascotShadow} resizeMode="contain" />
        {/* Mascot Image */}
        <Image 
          source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }} 
          style={styles.mascot} 
          resizeMode="contain"
        />
      </View>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/login')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
    position: 'relative',
  },
  bgHill: {
    position: 'absolute',
    width: '100%',
    height: 305, // From Figma
    bottom: 0,
    left: 0,
  },
  decorationsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 305, // Match hill height to position flowers relative to it
    zIndex: 1,
  },
  flower: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  sparkle: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: 'System', 
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    position: 'absolute',
    left: 61,
    top: 157,
  },
  mascotContainer: {
    position: 'absolute',
    left: 108,
    top: 399,
    width: 177,
    height: 187 + 23, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, 
  },
  mascot: {
    width: '100%',
    height: 187,
  },
  mascotShadow: {
    position: 'absolute',
    width: 71,
    height: 23,
    bottom: 0, 
    left: 52, 
  },
  button: {
    position: 'absolute',
    left: 112,
    top: 653,
    width: 169,
    height: 51,
    backgroundColor: '#ffffff',
    borderRadius: 25.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#267a60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 10,
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 20,
    color: '#000000',
  },
});
