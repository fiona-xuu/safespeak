<<<<<<< HEAD
import { Button, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SafeSpeak 🛡️</Text>
      <Text>Voice-Activated Safety Companion</Text>
      <Button title="Record" onPress={() => alert("Recording soon")} />
    </View>
  );
}
=======
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Asset Constants
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/902d9389-c23c-4201-8d85-5d38c0b08f3a";
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/03792837-dce1-4d8c-8a26-0d775d5d1016"; // Sparkles
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/b5815492-61e7-4a28-af63-145beb2564a0";
const imgEllipse207 = "https://www.figma.com/api/mcp/asset/bdb4d468-28ad-4ec7-b7fb-a1457a099d78"; // Green Dot

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Hill */}
      <Image 
        source={{ uri: imgEllipse1 }} 
        style={styles.bgEllipse} 
        resizeMode="cover"
      />

      {/* Decorative Sparkles */}
      <Image source={imgGroup18894} style={[styles.sparkle, { left: 314, top: 766 }]} />
      <Image source={imgGroup18894} style={[styles.sparkle, { left: 211, top: 583 }]} />
      <Image source={imgGroup18894} style={[styles.sparkle, { left: 96, top: 686 }]} />
      <Image source={imgGroup18924} style={[styles.sparkle, { left: 29, top: 785 }]} />
      <Image source={imgGroup18924} style={[styles.sparkle, { left: 332, top: 593 }]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <Text style={styles.cardSubtitle}>Activate to help you stay safe</Text>
          
          <View style={styles.idleTag}>
             <Image source={imgEllipse207} style={styles.greenDot} />
             <Text style={styles.idleText}>IDLE</Text>
          </View>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start SafeSpeak</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Menu */}
        <View style={styles.gridContainer}>
          {/* Record Button */}
          <TouchableOpacity 
            style={styles.gridButton} 
            onPress={() => router.push('/(tabs)/voice')}
          >
            <View style={styles.gridIconContainer}>
               <IconSymbol name="mic.fill" size={32} color="#000" />
            </View>
            <Text style={styles.gridLabel}>Record</Text>
          </TouchableOpacity>

          {/* Fake Call Button */}
          <TouchableOpacity 
            style={styles.gridButton}
            onPress={() => router.push('/(tabs)/call')}
          >
            <View style={styles.gridIconContainer}>
               <IconSymbol name="phone.fill" size={32} color="#000" />
            </View>
            <Text style={styles.gridLabel}>Fake Call</Text>
          </TouchableOpacity>

          {/* Emergency SOS Button - Spans full width visually in design but let's stick to grid or special styling */}
          {/* Design shows it as a square in grid, wait. No, design has 4 squares. */}
          {/* Design: Record(TL), Fake Call(TR), Emergency SOS(BL), Live Location(BR) */}
          
          {/* Emergency SOS */}
          <TouchableOpacity style={styles.gridButton}>
             <View style={styles.gridIconContainer}>
               <IconSymbol name="house.fill" size={32} color="#000" /> 
               {/* Using house as placeholder for SOS/Emergency icon if specific one isn't in mapping yet */}
            </View>
            <Text style={styles.gridLabel}>Emergency SOS</Text>
          </TouchableOpacity>

          {/* Live Location Share */}
          <TouchableOpacity 
            style={styles.gridButton}
            onPress={() => router.push('/(tabs)/location')} 
            // Note: Location tab was replaced by Call tab in previous turn, 
            // but if we want to restore location features we might need another route or modal.
            // For now, I'll point it to call or just leave it as placeholder since Location tab is gone.
            // Actually, let's just log or alert.
          >
             <View style={styles.gridIconContainer}>
               <IconSymbol name="location.fill" size={32} color="#000" />
            </View>
            <Text style={styles.gridLabel}>Live Location Share</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
  },
  bgEllipse: {
    position: 'absolute',
    width: '120%', 
    height: 422,
    left: -20,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
    marginLeft: 10,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    height: 195,
    borderWidth: 1,
    borderColor: '#966585',
    marginBottom: 20,
    position: 'relative',
  },
  cardTitle: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#966585',
    marginBottom: 15,
  },
  idleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#966585',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  greenDot: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  idleText: {
    fontWeight: '400',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#faacdd', // Matching other buttons
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  startButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gridButton: {
    width: '47%', // roughly half minus gap
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#966585',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  gridIconContainer: {
    marginBottom: 10,
  },
  gridLabel: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
>>>>>>> main
