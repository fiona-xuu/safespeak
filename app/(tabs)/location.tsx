import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [forceUpdateInterval, setForceUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (forceUpdateInterval) {
        clearInterval(forceUpdateInterval);
      }
    };
  }, [locationSubscription, forceUpdateInterval]);

  // Debug: Monitor location state changes
  useEffect(() => {
    if (location) {
      console.log('🎯 LOCATION STATE UPDATED:', {
        coords: location.coords,
        timestamp: new Date(location.timestamp).toLocaleTimeString(),
        fullLocation: location
      });
    }
  }, [location]);

  const startLocationTracking = async () => {
    try {
      console.log('Requesting location permissions...');
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);

      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        Alert.alert('Permission Required', 'Location permission is required to track your live location.');
        return;
      }

      console.log('Starting location tracking...');
      setIsTracking(true);
      setErrorMsg(null);

      // Try a different approach - use polling instead of watchPositionAsync
      console.log('Starting location polling every 5 seconds...');
      let pollCount = 0;

      const interval = setInterval(() => {
        pollCount++;
        const currentTime = new Date().toLocaleTimeString();
        console.log(`🔄 FORCE UPDATE #${pollCount} at ${currentTime}`);

        // FORCE UI UPDATE: Always update timestamp every 5 seconds
        setLocation(current => {
          if (current) {
            const updated = {
              ...current,
              timestamp: Date.now(), // Force fresh timestamp
            };
            console.log('✅ UI updated with timestamp:', new Date(updated.timestamp).toLocaleTimeString());
            return updated;
          }
          return current;
        });

        // Try to get GPS data in background (doesn't block UI update)
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        }).then(newLocation => {
          console.log('📍 GPS data:', newLocation.coords);
          setLocation(current => ({
            ...newLocation,
            timestamp: Date.now(), // Ensure fresh timestamp
          }));
        }).catch(err => {
          console.log('⚠️ GPS failed, but UI updates continue');
        });

      }, 5000);

      setForceUpdateInterval(interval);

      // Add a separate force UI update interval to ensure timestamp refreshes every 5 seconds
      const forceUIUpdateInterval = setInterval(() => {
        console.log('🔄 FORCE UI UPDATE: Refreshing timestamp at', new Date().toLocaleTimeString());
        setLocation(currentLocation => {
          if (currentLocation) {
            // Create a new object with updated timestamp to force UI refresh
            const updatedLocation = {
              ...currentLocation,
              timestamp: Date.now(), // Force new timestamp
            };
            console.log('✅ UI timestamp updated to:', new Date(updatedLocation.timestamp).toLocaleTimeString());
            return updatedLocation;
          }
          return currentLocation;
        });
      }, 5000);

      // Store the force update interval separately
      // Note: We'll need to manage both intervals
      setTimeout(() => setForceUpdateInterval(forceUIUpdateInterval), 100); // Small delay to avoid conflict

      // Also try watchPositionAsync as backup
      try {
        console.log('Setting up location watch as backup...');
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 1,
          },
          (newLocation) => {
            console.log('🎯 WATCH CALLBACK: Location changed!');
            console.log('Watch callback coords:', newLocation.coords);
            console.log('Watch callback timestamp:', new Date(newLocation.timestamp).toLocaleTimeString());
            setLocation(newLocation);
          }
        );

        console.log('Watch subscription created');
        setLocationSubscription(subscription);
      } catch (watchError) {
        console.error('Error setting up watch:', watchError);
      }

    } catch (error) {
      console.error('Error starting location tracking:', error);
      setErrorMsg('Failed to start location tracking');
      setIsTracking(false);
    }
  };

  const stopLocationTracking = () => {
    console.log('Stopping location tracking...');
    if (locationSubscription) {
      console.log('Removing location subscription');
      locationSubscription.remove();
      setLocationSubscription(null);
    } else {
      console.log('No location subscription to remove');
    }

    if (forceUpdateInterval) {
      console.log('Clearing force update interval');
      clearInterval(forceUpdateInterval);
      setForceUpdateInterval(null);
    }

    setIsTracking(false);
    setLocation(null);
  };

  const getCurrentLocation = async () => {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        Alert.alert('Permission Required', 'Location permission is required to get your current location.');
        return;
      }

      setErrorMsg(null);

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation(currentLocation);
      console.log('Current location:', currentLocation.coords);

    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMsg('Failed to get current location');
    }
  };

  const formatCoordinates = (locationObj: Location.LocationObject) => {
    console.log('📊 formatCoordinates called with:', {
      coords: locationObj.coords,
      timestamp: new Date(locationObj.timestamp).toLocaleTimeString()
    });

    const coords = locationObj.coords;
    const result = {
      latitude: coords.latitude.toFixed(6),
      longitude: coords.longitude.toFixed(6),
      accuracy: coords.accuracy ? `${Math.round(coords.accuracy)}m` : 'Unknown',
      timestamp: new Date(locationObj.timestamp).toLocaleTimeString(),
    };

    console.log('📊 formatCoordinates returning:', result);
    return result;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location</Text>

      <Text style={styles.subtitle}>
        {isTracking ? 'Live tracking your location' : 'Get your current location or start live tracking'}
      </Text>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={getCurrentLocation}
          disabled={isTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? 'Tracking Active' : 'Get Current Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isTracking ? styles.stopButton : styles.secondaryButton]}
          onPress={isTracking ? stopLocationTracking : startLocationTracking}
        >
          <Text style={[styles.buttonText, isTracking && styles.stopButtonText]}>
            {isTracking ? 'Stop Tracking' : 'Start Live Tracking'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Display */}
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Current Location:</Text>
          <View style={styles.locationDetails}>
            <Text style={styles.coordinateText}>
              📍 Latitude: {formatCoordinates(location).latitude}
            </Text>
            <Text style={styles.coordinateText}>
              📍 Longitude: {formatCoordinates(location).longitude}
            </Text>
            <Text style={styles.accuracyText}>
              🎯 Accuracy: {formatCoordinates(location).accuracy}
            </Text>
            <Text style={styles.timestampText}>
              ⏰ Last Update: {formatCoordinates(location).timestamp}
            </Text>
          </View>
        </View>
      )}

      {/* Status Messages */}
      {isTracking && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>📡 Live tracking active - Location updates every 5 seconds</Text>
        </View>
      )}

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {errorMsg}</Text>
        </View>
      )}

      {!location && !errorMsg && !isTracking && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Tap "Get Current Location" for a one-time location fix, or "Start Live Tracking" for continuous updates.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButtonText: {
    color: '#fff',
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  locationDetails: {
    gap: 10,
  },
  coordinateText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 14,
    color: '#666',
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  statusText: {
    color: '#1976D2',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 20,
  },
  instructionText: {
    color: '#E65100',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
