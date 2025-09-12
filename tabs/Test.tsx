import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GetLocation from "react-native-get-location";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function NavigationScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRoute, setMapRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  // --- Example route from API (call once at start of navigation) ---
  useEffect(() => {
    const fetchInitialRoute = async () => {
      // Call Google Directions API here once
      // const points = decodePolyline(response.routes[0].overview_polyline.points);
      // setMapRoute(points);

      // Mock: simulate a sample route
      setMapRoute([
        { latitude: 3.1412, longitude: 101.6865 },
        { latitude: 3.1420, longitude: 101.6880 },
        { latitude: 3.1435, longitude: 101.6895 },
      ]);
    };

    fetchInitialRoute();
  }, []);

  // --- Poll location every 5s ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const loc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });

        const { latitude, longitude } = loc;
        setLocation({ latitude, longitude });

        // Trim route so polyline shortens
        shortenRoute(latitude, longitude);
      } catch (err) {
        console.warn("Location error:", err);
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [mapRoute]);

  // --- Trim polyline based on closest point ---
  const shortenRoute = (userLat: number, userLng: number) => {
    if (!mapRoute.length) return;

    let minDist = Infinity;
    let closestIndex = 0;

    mapRoute.forEach((point, idx) => {
      const d = Math.sqrt(
        Math.pow(point.latitude - userLat, 2) + Math.pow(point.longitude - userLng, 2)
      );
      if (d < minDist) {
        minDist = d;
        closestIndex = idx;
      }
    });

    // keep only remaining path
    setMapRoute((prev) => prev.slice(closestIndex));
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 3.1412,
          longitude: 101.6865,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && <Marker coordinate={location} />}
        {mapRoute.length > 1 && <Polyline coordinates={mapRoute} strokeWidth={4} strokeColor="blue" />}
      </MapView>
      <View style={{ padding: 10 }}>
        <Text>Current Location: {location ? `${location.latitude}, ${location.longitude}` : "Fetching..."}</Text>
      </View>
    </View>
  );
}