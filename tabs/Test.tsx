import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Button,
} from 'react-native';
import GetLocation from 'react-native-get-location';

export default function Test() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request Android runtime permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS automatically asks permission
  };

  const fetchLocation = async () => {
    // Ask for permission first
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access location');
      return;
    }

    // Then get location
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then((loc) => {
        console.log(loc);
        setLocation({ latitude: loc.latitude, longitude: loc.longitude });
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
        Alert.alert(`Error (${code})`, message);
      });
  };

  // Only trigger location fetch on mount if you want "onload" behavior
  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location:</Text>
      {location ? (
        <Text style={styles.text}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>Fetching location...</Text>
      )}

      {/* Optional: Button to refresh location */}
      <Button title="Refresh Location" onPress={fetchLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20 },
});