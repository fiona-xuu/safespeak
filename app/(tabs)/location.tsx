import { useSafeSpeak } from '@/contexts/SafeSpeakContext';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reusing assets from dashboard to maintain consistent style
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/902d9389-c23c-4201-8d85-5d38c0b08f3a";
const imgGroup18894 = "https://www.figma.com/api/mcp/asset/03792837-dce1-4d8c-8a26-0d775d5d1016"; // Sparkles
const imgGroup18924 = "https://www.figma.com/api/mcp/asset/b5815492-61e7-4a28-af63-145beb2564a0";

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [forceUpdateInterval, setForceUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const { status, setStatus } = useSafeSpeak();

  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      setIsTracking(true);
      setErrorMsg(null);
      setStatus('has_used_features');

      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error(error);
      setIsTracking(false);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    setIsTracking(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error(error);
    }
  };

  const formatCoordinate = (coord: number) => coord.toFixed(6);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background Hill (Consistent with Dashboard) */}
      <Image 
        source={{ uri: imgEllipse1 }} 
        style={styles.bgEllipse} 
        resizeMode="cover"
      />

      {/* Decorative Sparkles */}
      <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 314, top: 766 }]} />
      <Image source={{ uri: imgGroup18894 }} style={[styles.sparkle, { left: 211, top: 583 }]} />
      <Image source={{ uri: imgGroup18924 }} style={[styles.sparkle, { left: 29, top: 785 }]} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Live Location</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Status</Text>
          <Text style={styles.cardSubtitle}>
            {isTracking ? 'Currently tracking your location' : 'Tracking is inactive'}
          </Text>

          {location ? (
            <View style={styles.locationInfo}>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Latitude:</Text>
                <Text style={styles.coordinateValue}>{formatCoordinate(location.coords.latitude)}</Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Longitude:</Text>
                <Text style={styles.coordinateValue}>{formatCoordinate(location.coords.longitude)}</Text>
              </View>
              {location.coords.accuracy && (
                <View style={styles.coordinateRow}>
                  <Text style={styles.coordinateLabel}>Accuracy:</Text>
                  <Text style={styles.coordinateValue}>±{Math.round(location.coords.accuracy)}m</Text>
                </View>
              )}
              <Text style={styles.timestamp}>
                Last updated: {new Date(location.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ) : (
            <Text style={styles.noLocationText}>No location data available</Text>
          )}

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={isTracking ? stopLocationTracking : startLocationTracking}
            >
              <Text style={styles.buttonText}>
                {isTracking ? 'Stop Tracking' : 'Start Live Tracking'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={getCurrentLocation}
              disabled={isTracking}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Get Current Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Live Location</Text>
          <Text style={styles.infoText}>
            Sharing your location helps your trusted contacts know where you are in case of an emergency. 
            Location data is encrypted and only shared when you activate this feature.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6', // Consistent background color
  },
  bgEllipse: {
    position: 'absolute',
    width: '120%', 
    height: 422,
    left: -20,
    bottom: 0,
    opacity: 0.8,
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
    paddingBottom: 40,
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#966585',
    shadowColor: '#8d234b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    fontSize: 14,
    color: '#966585',
    marginBottom: 20,
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  coordinateValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'System', // Monospace font not strictly required if System looks good
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  noLocationText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 20,
    padding: 20,
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#faacdd',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#faacdd',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#faacdd',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 101, 133, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
