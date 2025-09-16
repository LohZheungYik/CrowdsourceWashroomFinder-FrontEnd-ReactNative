import { useState, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import GetLocation from "react-native-get-location";

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const lastCallRef = useRef<number>(0); // track last call timestamp

  const fetchLocation = async () => {
    const now = Date.now();

    // Prevent spam taps: only allow once every 2s
    if (now - lastCallRef.current < 2000) {
      //console.warn("Debounced: too many requests");
      return;
    }
    lastCallRef.current = now;

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      alert("Permission Denied");
      return;
    }

    try {
      // Try high accuracy first
      const loc = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000, // 20s
      });

      setLocation({ latitude: loc.latitude, longitude: loc.longitude });
    } catch (error: any) {
      console.warn("High accuracy failed:", error.message);

      // fallback: try again with lower accuracy
      try {
        const fallbackLoc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
        });

        setLocation({ latitude: fallbackLoc.latitude, longitude: fallbackLoc.longitude });
      } catch (fallbackError: any) {
        console.warn("Low accuracy failed:", fallbackError.message);
        alert(fallbackError.message);
      }
    }
  };

  return { location, fetchLocation };
};