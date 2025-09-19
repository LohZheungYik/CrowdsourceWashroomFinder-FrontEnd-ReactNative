import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, Pressable, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '../Constants'
import GetLocation from 'react-native-get-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

type NavigateProps = {
  route: {
    params: {
      washroomId: number,
      name: string,
      destiLat: number,
      destiLng: number
    };
  };
};

export default function Navigate({ route }: NavigateProps) {
  type NavigateNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Navigate'>;
  const navigation = useNavigation<NavigateNavigationProp>();

  const { height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRoute, setMapRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  // refs
  const fetchingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasArrivedRef = useRef<boolean>(false);

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
    return true;
  };

  // --- Haversine distance (in meters) ---
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // meters
  };

  // --- Trim polyline based on closest point to user ---
  const shortenRoute = (userLat: number, userLng: number) => {
    setMapRoute((prevMapRoute) => {
      if (!prevMapRoute.length) return prevMapRoute;

      let minDist = Infinity;
      let closestIndex = 0;

      for (let idx = 0; idx < prevMapRoute.length; idx++) {
        const point = prevMapRoute[idx];
        const d = Math.sqrt(
          Math.pow(point.latitude - userLat, 2) + Math.pow(point.longitude - userLng, 2)
        );
        if (d < minDist) {
          minDist = d;
          closestIndex = idx;
        }
      }

      if (closestIndex >= prevMapRoute.length - 1) {
        return prevMapRoute.slice(prevMapRoute.length - 1);
      }

      return prevMapRoute.slice(closestIndex);
    });
  };

  // --- Initial fetch of current location + route (runs once) ---
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        alert('Permission Denied');
        return;
      }

      if (!mounted) return;

      fetchingRef.current = true;
      try {
        const loc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });

        if (!mounted) return;

        setLocation({ latitude: loc.latitude, longitude: loc.longitude });

        const res = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${loc.latitude},${loc.longitude}&destination=${route.params.destiLat},${route.params.destiLng}&key=${GOOGLE_API_KEY}`
        );
        const data = await res.json();

        if (data.routes && data.routes.length) {
          const points = polyline.decode(data.routes[0].overview_polyline.points);
          const coords = points.map(([lat, lng]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          }));
          if (mounted) setMapRoute(coords);
        }
      } catch (err) {
        console.error('Error initializing navigation:', err);
      } finally {
        fetchingRef.current = false;
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [route.params]);

  // --- Poll location every 5 seconds (no overlapping calls) ---
  useEffect(() => {
    const startPolling = () => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(async () => {
        if (fetchingRef.current) return;

        fetchingRef.current = true;
        try {
          const loc = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });

          const { latitude, longitude } = loc;
          setLocation({ latitude, longitude });

          shortenRoute(latitude, longitude);

          // --- Check arrival ---
          const distance = getDistance(latitude, longitude, end.latitude, end.longitude);
          if (!hasArrivedRef.current && distance < 50) { // within 50m
            hasArrivedRef.current = true;
            Alert.alert("Arrived!", `You have reached ${route.params.name}`);
            // Optional: stop polling after arrival
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (err) {
          console.warn('Polling location error:', err);
        } finally {
          fetchingRef.current = false;
        }
      }, 5000);
    };

    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      fetchingRef.current = false;
    };
  }, []);

  const start = location == null
    ? { latitude: 3.139, longitude: 101.6869 }
    : { latitude: location.latitude, longitude: location.longitude };

  const end = { latitude: route.params.destiLat, longitude: route.params.destiLng };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Appbar.Header style={{ backgroundColor: 'rgba(77, 168, 87, 1)' }}>
        <Appbar.Content title="" />
      </Appbar.Header>

      {/* Top Info Box */}
      <View
        style={{
          width: '90%',
          height: 100,
          borderRadius: 10,
          backgroundColor: 'white',
          position: 'absolute',
          top: insets.top + 56 - 50 / 2,
          marginHorizontal: '5%',
          zIndex: 10,
          elevation: 24,
          padding: '2%',
        }}
      >
        <Text style={{ fontSize: 15 }}>Navigating Towards</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 25 }} numberOfLines={1} ellipsizeMode="tail">
          {route.params.name}
        </Text>
      </View>

      {/* Map */}
      <MapView
        style={{ flex: 5, zIndex: 1 }}
        initialRegion={{
          latitude: start.latitude,
          longitude: start.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        <Marker coordinate={end} title={route.params.name} />

        {mapRoute.length > 0 && (
          <Polyline coordinates={mapRoute} strokeColor="rgba(77,168,87,1)" strokeWidth={5} />
        )}
      </MapView>

      {/* Bottom Buttons */}
      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          marginBottom: '2%',
          zIndex: 4,
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.1,
          marginHorizontal: '2%',
          borderRadius: 10,
        }}
      >
        <View style={{ flexDirection: 'row', marginLeft: '2%', marginTop: 20 }}>
          <Pressable
            onPress={() =>
              navigation.navigate("Survey", {
                washroomId: route.params.washroomId,
              })
            }
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 15,
                elevation: 4,
                marginRight: 8,
                backgroundColor: 'rgba(218, 254, 207, 1)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="checkmark-done" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Mark as Arrived</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              //navigation.navigate("FindWC", { washroomId: null })
              navigation.navigate("Tabs", {
                        screen: "Find Washroom",
                        //params: { washroomId },
                    })
            } 
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 15,
                elevation: 4,
                marginRight: 8,
                backgroundColor: 'rgba(233, 212, 216, 1)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="close" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Stop Navigate</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}