import { GreenHillSvg } from '@/components/ui/GreenHillSvg';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Asset Constants
const imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 = "https://www.figma.com/api/mcp/asset/3879cbdb-56fd-4594-a25d-bc1b70827f45"; // Pixel Girl / Mascot
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/03792837-dce1-4d8c-8a26-0d775d5d1016"; // Sparkles
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/b5815492-61e7-4a28-af63-145beb2564a0";
const imgEllipse207 = "https://www.figma.com/api/mcp/asset/bdb4d468-28ad-4ec7-b7fb-a1457a099d78"; // Green Dot

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Hill using the SVG Component */}
      <View style={styles.bgHill}>
        <GreenHillSvg />
      </View>

      {/* Decorative Sparkles */}
      <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 314, top: 766 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 211, top: 583 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 96, top: 686 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.sparkle, { left: 29, top: 785 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.sparkle, { left: 332, top: 593 }]} />

      {/* Pixel Girl / Mascot */}
      <View style={styles.mascotContainer}>
        <Image 
          source={{ uri: imgGeminiGeneratedImageSngzz8Sngzz8SngzRemovebgPreview1 }} 
          style={styles.mascot} 
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <Text style={styles.cardSubtitle}>Activate to help you stay safe</Text>
          
          <View style={styles.idleTag}>
             <Image source={{ uri: imgEllipse207 }} style={styles.greenDot} />
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

          {/* Live Location Share */}
          <TouchableOpacity 
            style={styles.gridButton}
            onPress={() => router.push('/(tabs)/location')} 
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
  bgHill: {
    position: 'absolute',
    width: '100%', 
    height: 305,
    left: 0,
    bottom: 0,
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    width: 36,
    height: 36,
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    zIndex: 2,
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
  mascotContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 120,
    height: 120,
    zIndex: 10,
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
});
