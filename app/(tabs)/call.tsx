import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Asset Constants from Figma
const imgEllipse205 = "https://www.figma.com/api/mcp/asset/95381ef5-6cab-43ef-8536-a0893a06a1b1";
const imgEllipse207 = "https://www.figma.com/api/mcp/asset/5cd6d211-4104-4496-8b35-d14e3e3e0054";
const imgEllipse209 = "https://www.figma.com/api/mcp/asset/3228080b-b475-4f23-8093-d1239bda3bd8";

export default function FakeCallScreen() {
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Simulated Call</Text>
      <Text style={styles.headerSubtitle}>
        Create the appearance of an incoming call to help you leave a situation safely
      </Text>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Image source={{ uri: imgEllipse205 }} style={styles.statusDot} />
          <Text style={styles.statusText}>Simulation Call Status</Text>
        </View>
        
        <View style={styles.statusRow}>
           <Image source={{ uri: imgEllipse207 }} style={styles.statusDot} />
           <Text style={styles.statusText}>Voice-type</Text>
        </View>

        <Text style={styles.statusTextInfo}>Call-in delay</Text>
        
        <View style={styles.timeRow}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.statusTextInfo}>Time-elapsed</Text>
        </View>
      </View>

      {/* Main Call Card */}
      <View style={styles.callCard}>
        <Text style={styles.countdownText}>
          Call Countdown: <Text style={styles.countdownNumber}>{countdown}</Text> seconds
        </Text>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Image source={{ uri: imgEllipse205 }} style={styles.statusDot} />
           <View style={styles.dotsRow}>
              <Image source={{ uri: imgEllipse209 }} style={styles.smallDot} />
              <Image source={{ uri: imgEllipse209 }} style={styles.smallDot} />
              <Image source={{ uri: imgEllipse209 }} style={styles.smallDot} />
           </View>
        </View>

         {/* Placeholder for "Text" or interactions */}
         <Text style={styles.placeholderText}>Text</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
    alignItems: 'center',
    paddingTop: 100, // Adjust based on header height
  },
  headerTitle: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 24,
    color: '#000000',
    position: 'absolute',
    top: 100, // Moved up from 148
    left: 36,
  },
  headerSubtitle: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#966585',
    textAlign: 'center',
    width: 320,
    position: 'absolute',
    top: 150, // Moved up from 192
    alignSelf: 'center',
  },
  statusCard: {
    position: 'absolute',
    top: 200, // Moved up from 243
    width: 305,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 25.5,
    shadowColor: '#8d234b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.27,
    shadowRadius: 20,
    elevation: 5,
    padding: 20,
  },
  callCard: {
    position: 'absolute',
    top: 380, // Moved up from 431
    width: 305,
    height: 344,
    backgroundColor: '#ffffff',
    borderRadius: 25.5,
    shadowColor: '#8d234b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.27,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
    paddingTop: 27,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 20, // Align with dots
  },
  statusDot: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#aaa5a9',
  },
  statusTextInfo: {
    fontSize: 16,
    color: '#aaa5a9',
    textAlign: 'center',
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 20,
  },
  timerText: {
    fontSize: 16,
    color: '#aaa5a9',
  },
  countdownText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
  },
  countdownNumber: {
    color: '#de665e',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 20, // Match design padding
    marginBottom: 100,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(214,214,214,0.31)',
    borderRadius: 25.5,
    paddingHorizontal: 10,
    height: 17,
    justifyContent: 'space-between',
    width: 38,
    marginLeft: 10,
  },
  smallDot: {
    width: 5,
    height: 5,
  },
  placeholderText: {
    fontSize: 16,
    color: '#000000',
  },
});

