import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Pressable, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '../Constants'
import GetLocation from 'react-native-get-location';

type NavigateProps = {
  route : {
    params: {
      name: string,
      destiLat: number,
      destiLng: number
    };
  };
};

export default function Navigate({route}: NavigateProps) {
  const { height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  // alert("destiLat : " + route.params.destiLat);
  // alert("destiLng : " + route.params.destiLng);
  

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
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

  const fetchLocation = async () => {
    // Ask permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      alert('Permission Denied');
      return;
    }

    // get location
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
        alert(message);
      });
  };

  useEffect(() => {
    fetchLocation();
  }, []);


  const start = location == null ? { latitude: 3.139, longitude: 101.6869 } : {latitude: location.latitude, longitude: location.longitude};

  const end = { latitude: route.params.destiLat, longitude: route.params.destiLng };  // destination

  const [mapRoute, setMapRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${route.params.destiLat},${route.params.destiLng}&key=${GOOGLE_API_KEY}`
        );
        const data = await res.json();

        if (data.routes.length) {
          const points = polyline.decode(data.routes[0].overview_polyline.points);
          const coords = points.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setMapRoute(coords);
        }
      } catch (err) {
        console.error('Error fetching directions:', err);
      }
    };

    fetchRoute();
  }, [location, route.params]);

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
        <Text
          style={{ fontWeight: 'bold', fontSize: 25 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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
        {/* <Marker coordinate={start} title="You are here" description="Kuala Lumpur" /> */}
        <Marker coordinate={end} title={route.params.name} />

        {mapRoute.length > 0 && (
          <Polyline
            coordinates={mapRoute}
            strokeColor="rgba(77,168,87,1)"
            strokeWidth={5}
          />
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