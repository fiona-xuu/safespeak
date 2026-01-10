import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Asset Constants (using remote URLs from Figma for now)
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/8ad9b305-2217-40af-a0d3-2165d7acf4f1";
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/c772a36d-730c-41ce-92da-659cb93c32d2";
// Decorative groups - omitting some minor decorative elements for cleaner initial implementation or using placeholders
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/45bac421-bfed-4ffd-98a0-4f47caa2866c";
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/3ee8f67d-a456-4c44-8e66-f5de2dcf0341";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Ellipse */}
      <Image 
        source={{ uri: imgEllipse1 }} 
        style={styles.bgEllipse} 
        contentFit="cover"
      />

      {/* Decorative Elements */}
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 314, top: 766 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 211, top: 590 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 96, top: 686 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 29, top: 785 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 332, top: 593 }]} />

      {/* Main Content */}
      <Text style={styles.title}>Welcome to SafeSpeak</Text>

      {/* Mascot Image */}
      <View style={styles.mascotContainer}>
        <Image 
          source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }} 
          style={styles.mascot} 
          contentFit="contain"
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
  bgEllipse: {
    position: 'absolute',
    width: 646,
    height: 422,
    left: -126,
    top: 547,
  },
  title: {
    fontFamily: 'System', // 'Inter-Bold' in design, falling back to System for now
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
    height: 187,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascot: {
    width: '100%',
    height: '100%',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'System', // 'Inter-Regular'
    fontSize: 20,
    color: '#000000',
  },
  decoStar: {
    position: 'absolute',
    width: 36,
    height: 36,
  }
});

