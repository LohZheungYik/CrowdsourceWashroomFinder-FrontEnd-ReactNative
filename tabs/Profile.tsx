import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Profile() {

  type Option = { label: string };

  let options = [
    { label: "All" },
    { label: "Disable friendly" },
    { label: "Family friendly" },
    { label: "OCD friendly" },
    { label: "OCD friendly2" }
  ]

  type Feature = {
    label: string,
    color: string
  }

  let features = [
    {label: "♿️ Wheelchair-accessible", color: "rgba(208,232,243, 1)"},
    {label: "👶 Baby-friendly", color: "rgba(223,203,243,1)"},
    {label: "🤰 Pregnancy-friendly", color: "rgba(233, 212, 216, 1)"},
  ];

  const { width, height } = Dimensions.get("window");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)" }}>
        <Appbar.Content title="" />
      </Appbar.Header>

      <TextInput
        placeholder="🔍 Type here to search...."
        style={{
          width: "90%",
          height: 50,
          borderRadius: 10,
          backgroundColor: "white",
          position: "absolute",
          top: insets.top + 56 - 50 / 2,
          marginHorizontal: "5%",
          zIndex: 10,
          elevation: 24,

        }}
      />


      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ height: 60, marginLeft: "2%", position: "absolute", marginTop: 56 + 25, zIndex: 2 }} contentContainerStyle={{
          paddingEnd: 10,
          alignItems: "center",


        }} >

        {
          options.map((option, i) => (
            <Pressable key={i} onPress={() => { setSelectedTab(i); }}>
              <View

                style={{
                  marginRight: i === options.length - 1 ? 0 : 10, // no margin after last item
                  borderRadius: 10,
                  backgroundColor: selectedTab === i ? "rgba(218, 254, 207, 1)" : "white",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  elevation: 4,

                }}
              >
                <Text>{option.label}</Text>
              </View>
            </Pressable>
          ))
        }

      </ScrollView>


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
      <View style={{ padding: "2%", flexDirection: "column", position: "absolute", marginBottom: "2%", zIndex: 4, elevation: 10, bottom: 0, left: 0, right: 0, height: height * 0.3, backgroundColor: "white", marginHorizontal: "2%", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", marginLeft: "2%" }}>
          
          <Text style={{fontWeight: "bold", fontSize: 25}} numberOfLines={2}
    ellipsizeMode="tail" >TRX Premium Toilet TRX Premium Toilet TRX Premium Toilet</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: "2%"}}>
          <Text style={{fontSize: 15}} numberOfLines={2}
    ellipsizeMode="tail">Ground floor near the chop shop Ground floor near the chop shop Ground floor near the chop shop</Text>
        </View>
        
        <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ height: 60, marginLeft: "2%",  zIndex: 2 }} contentContainerStyle={{
          paddingEnd: 10,
          alignItems: "center",


        }} >
          {
            features.map((feature, i) => (
              <View style={{paddingHorizontal: 4, paddingVertical: 2, borderWidth: 0, marginRight: 10, borderRadius: 10, backgroundColor: feature.color, elevation: 4}}>
                <Text>{feature.label}</Text>
              </View>
            ))
          }
        </ScrollView>

        <View style={{ flexDirection: "row", marginLeft: "2%" }}>
          {[...Array(5)].map((_, i) => (
            <Ionicons name="star" size={16} style={{ marginRight: 6 }} />
          ))}
        </View>

        <View style={{ flexDirection: "row", marginLeft: "2%", marginTop: 20 }}>

          <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
            style={({ pressed }) => [{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 15,
              elevation: 4,
              marginRight: 8,
              backgroundColor: "rgba(218, 254, 207, 1)",
              opacity: pressed ? 0.7 : 1,
            }]}>

            <Ionicons name="information-circle" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>View Details</Text>
          </Pressable>

          <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
            style={({ pressed }) => [{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 15,
              elevation: 4,
              marginRight: 8,
              backgroundColor: "rgba(151, 233, 126, 1)",
              opacity: pressed ? 0.7 : 1,
            }]}>

            <Ionicons name="navigate" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Go There</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
