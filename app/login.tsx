import { GreenHillSvg } from '@/components/ui/GreenHillSvg';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

// Asset Constants
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/24a3fb9e-ec4e-4ead-884d-ce070a618429";
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/168c1ce1-ad9f-4aab-a50a-d77fc290b3e3";
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/80901aca-e3c6-4a10-82ae-7a9632810233";
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/b8e3c14d-39f8-4316-94cd-bf758bdfdd39";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login Error:", error); // Debugging log
      // Check for generic invalid credentials message (covers both wrong password and user not found)
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        Alert.alert(
          "Account Not Found or Incorrect Password",
          "If you don't have an account, please sign up. Otherwise, check your password.",
          [
            { text: "Try Again", style: "cancel" },
            { text: "Sign Up", onPress: () => router.push('/signup') }
          ]
        );
      } else {
        Alert.alert("Login Failed", error.message);
      }
      setLoading(false);
    } else {
      // AuthProvider will handle navigation
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Hill (SVG) */}
      <View style={styles.bgHill}>
        <GreenHillSvg height={422} />
      </View>

      {/* Decorative Elements */}
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 314, top: 766 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 211, top: 590 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 96, top: 686 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 29, top: 785 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 332, top: 593 }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.title}>Log In</Text>

          {/* Email Input */}
          <View style={[styles.inputContainer, { top: 218 }]}>
            <Feather name="mail" size={24} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#966585"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, { top: 286 }]}>
            <Feather name="lock" size={24} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#966585"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Log In Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log In"}</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity 
            style={styles.signupLink} 
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signupText}>
              Don’t have an account? <Text style={styles.signupTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>

          {/* Mascot Image */}
          <View style={styles.mascotContainer}>
            <Image 
              source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }} 
              style={styles.mascot} 
              resizeMode="contain"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: 800, 
  },
  bgHill: {
    position: 'absolute',
    width: '100%',
    height: 422,
    left: 0,
    top: 547, // Adjusting to match previous position relative to top
    zIndex: 0,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    position: 'absolute',
    left: 61,
    top: 145,
  },
  inputContainer: {
    position: 'absolute',
    left: 61,
    width: 271,
    height: 51,
    backgroundColor: '#ffffff',
    borderRadius: 25.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#8d234b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.27,
    shadowRadius: 20,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  button: {
    position: 'absolute',
    left: 61,
    top: 354,
    width: 271,
    height: 51,
    backgroundColor: '#faacdd',
    borderRadius: 25.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8d234b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.27,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  signupLink: {
    position: 'absolute',
    left: 100,
    top: 421,
  },
  signupText: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#966585',
  },
  signupTextBold: {
    color: '#73004b',
    fontWeight: '700',
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
  decoStar: {
    position: 'absolute',
    width: 36,
    height: 36,
  }
});
