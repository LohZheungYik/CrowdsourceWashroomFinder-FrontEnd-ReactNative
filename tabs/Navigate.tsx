import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Navigate() {

  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)" }}>
        <Appbar.Content title="" />
      </Appbar.Header>

      <View
        style={{
          width: "90%",
          height: 100,
          borderRadius: 10,
          backgroundColor: "white",
          position: "absolute",
          top: insets.top + 56 - 50 / 2,
          marginHorizontal: "5%",
          zIndex: 10,
          elevation: 24,
          padding: "2%"

        }}
      >
        <Text style={{fontSize: 15}}>Navigating Towards</Text>
        <Text style={{fontWeight: "bold", fontSize: 25}} numberOfLines={1}
    ellipsizeMode="tail">TRX Premium Toilet</Text>
        

      </View>

      <MapView
        style={{ flex: 5, zIndex: 1 }}
        initialRegion={{
          latitude: 3.139,   // Example: Kuala Lumpur
          longitude: 101.6869,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 3.139, longitude: 101.6869 }}
          title="You are here"
          description="Kuala Lumpur"
        />
      </MapView>
      <View style={{ flexDirection: "column", position: "absolute", marginBottom: "2%", zIndex: 4, bottom: 0, left: 0, right: 0, height: height * 0.1, marginHorizontal: "2%", borderRadius: 10 }}>


        <View style={{ flexDirection: "row", marginLeft: "2%", marginTop: 20 }}>

          <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
            style={({ pressed }) => [{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 15,
              elevation: 4,
              marginRight: 8,
              backgroundColor: "rgba(218, 254, 207, 1)",
              opacity: pressed ? 0.7 : 1,
            }]}>

            <Ionicons name="checkmark-done" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Mark as Arrived</Text>
          </Pressable>

          <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
            style={({ pressed }) => [{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 15,
              elevation: 4,
              marginRight: 8,
              backgroundColor: "rgba(233, 212, 216, 1)",
              opacity: pressed ? 0.7 : 1,
            }]}>

            <Ionicons name="close" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Stop Navigate  </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
