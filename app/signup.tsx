import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

// Asset Constants
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/4ac6a033-9603-4210-8f80-e930e47c060f";
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/5b6155a6-3c10-42b3-aaaf-4adb0802c476";
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/36a25015-323b-4e63-b13d-11d58dc55d27";
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/6a8b21e0-34c9-4fcd-89aa-9840c4f5a8ec";

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      Alert.alert("Signup Failed", error.message);
      setLoading(false);
    } else {
      if (!session) {
        Alert.alert("Please check your inbox for email verification!");
      }
      setLoading(false);
      // AuthProvider will handle navigation if session is created immediately (often requires email confirmation)
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Ellipse */}
      <Image 
        source={{ uri: imgEllipse1 }} 
        style={styles.bgEllipse} 
        resizeMode="cover"
      />

      {/* Decorative Elements */}
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 314, top: 766 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.decoStar, { left: 211, top: 590 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 96, top: 686 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 29, top: 785 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.decoStar, { left: 332, top: 593 }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.title}>Sign Up</Text>

          {/* Username Input */}
          <View style={[styles.inputContainer, { top: 181 }]}>
            <SimpleLineIcons name="user" size={20} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#966585"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email Input */}
          <View style={[styles.inputContainer, { top: 249 }]}>
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
          <View style={[styles.inputContainer, { top: 317 }]}>
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

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          {/* Log In Link */}
          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginTextBold}>Log In</Text>
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
  bgEllipse: {
    position: 'absolute',
    width: 646,
    height: 422,
    left: -126,
    top: 547,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    position: 'absolute',
    left: 62,
    top: 108,
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
    top: 385,
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
  loginLink: {
    position: 'absolute',
    left: 96,
    top: 449,
  },
  loginText: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#966585',
  },
  loginTextBold: {
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
