import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function FindWC() {

  type Option = { label: string };

  let options: Option[] = [
    { label: "All" },
    { label: "Disable friendly" },
    { label: "Baby friendly" },
    { label: "Pregnant friendly" }
  ]



  type Feature = {
    label: string,
    color: string
  }

  let features: Feature[] = [
    { label: "♿️ Wheelchair-accessible", color: "rgba(208,232,243, 1)" },
    { label: "👶 Baby-friendly", color: "rgba(223,203,243,1)" },
    { label: "🤰 Pregnancy-friendly", color: "rgba(233, 212, 216, 1)" },
  ];

  type Place = {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    rating: number; // 1 to 5
    isDisableFriendly: boolean;
    isPregnantFriendly: boolean;
    isBabyFriendly: boolean;
  }

  // const places: Place[] = [
  //   {
  //     id: '1',
  //     name: 'TRX Premium Toilet',
  //     description: 'Ground floor near the chop shop',
  //     latitude: 3.1390,
  //     longitude: 101.6869,
  //     rating: 5,
  //     isDisableFriendly: true,
  //     isPregnantFriendly: false,
  //     isBabyFriendly: true,
  //   },
  //   {
  //     id: '2',
  //     name: 'KLCC Toilet',
  //     description: 'Inside Suria KLCC, near the elevator',
  //     latitude: 3.1579,
  //     longitude: 101.7120,
  //     rating: 4,
  //     isDisableFriendly: true,
  //     isPregnantFriendly: true,
  //     isBabyFriendly: true,
  //   },
  //   {
  //     id: '3',
  //     name: 'Bukit Bintang Toilet',
  //     description: 'Near Pavilion Mall, level 2',
  //     latitude: 3.1460,
  //     longitude: 101.7100,
  //     rating: 3,
  //     isDisableFriendly: false,
  //     isPregnantFriendly: true,
  //     isBabyFriendly: false,
  //   },
  //   {
  //     id: '4',
  //     name: 'Chinatown Toilet',
  //     description: 'Public toilet near Petaling Street',
  //     latitude: 3.1455,
  //     longitude: 101.6950,
  //     rating: 2,
  //     isDisableFriendly: false,
  //     isPregnantFriendly: false,
  //     isBabyFriendly: true,
  //   },
  //   {
  //     id: '5',
  //     name: 'KL Tower Toilet',
  //     description: 'Observation deck, level 3',
  //     latitude: 3.1520,
  //     longitude: 101.7030,
  //     rating: 5,
  //     isDisableFriendly: true,
  //     isPregnantFriendly: true,
  //     isBabyFriendly: false,
  //   },
  //   {
  //     id: '6',
  //     name: 'Mid Valley Toilet',
  //     description: 'Level 1, near the main entrance',
  //     latitude: 3.1162,
  //     longitude: 101.6774,
  //     rating: 4,
  //     isDisableFriendly: true,
  //     isPregnantFriendly: false,
  //     isBabyFriendly: true,
  //   },
  // ];

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://192.168.43.233:8000/api/washrooms")
      .then((response) => {
        alert(response.data[0].id)
        setPlaces(response.data);
      }).catch((error) => {
        console.error("Error fetching data")
      }).finally(() => {
        setLoading(false);
      })
  }, [])

  const { width, height } = Dimensions.get("window");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const insets = useSafeAreaInsets();

  //info box items : name, desc, features, rating

  const [name, setName] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('');
  // const [isDisableFriendly, setIsDisableFriendly] = React.useState<boolean>(false);
  // const [isBabyFriend, setIsBabyFriendly] = React.useState<boolean>(false);
  // const [isPregnantFriendly, setIsPregnantFriendly] = React.useState<boolean>(false);
  const [rating, setRating] = React.useState<number>(0);
  const [featureList, setFeatureList] = React.useState<boolean[]>([false, false, false]);

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
        key={`map-${selectedTab}`} // force re-render when tab changes
        style={{ flex: 5, zIndex: 1 }}
        initialRegion={{
          latitude: 3.139,
          longitude: 101.6869,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {places
          .filter(place => {
            if (selectedTab === 0) return true;
            if (selectedTab === 1) return place.isDisableFriendly;
            if (selectedTab === 2) return place.isBabyFriendly;
            if (selectedTab === 3) return place.isPregnantFriendly;
            return false;
          })
          .map(place => (
            <Marker
              key={place.id} // stable unique key
              coordinate={{ latitude: place.lat, longitude: place.lng }}
              onPress={() => {
                setName(place.name);
                setDescription(place.description);
                setFeatureList([
                  place.isDisableFriendly,
                  place.isBabyFriendly,
                  place.isPregnantFriendly,
                ]);
                setRating(place.rating);
              }}
            />
          ))}
      </MapView>
      {name && <View style={{ padding: "2%", flexDirection: "column", position: "absolute", marginBottom: "2%", zIndex: 4, elevation: 10, bottom: 0, left: 0, right: 0, height: height * 0.3, backgroundColor: "white", marginHorizontal: "2%", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", marginLeft: "2%" }}>

          <Text style={{ fontWeight: "bold", fontSize: 25 }} numberOfLines={2}
            ellipsizeMode="tail" >{name}</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: "2%" }}>
          <Text style={{ fontSize: 15 }} numberOfLines={2}
            ellipsizeMode="tail">{description}</Text>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ height: 60, marginLeft: "2%", zIndex: 2 }} contentContainerStyle={{
            paddingEnd: 10,
            alignItems: "center",


          }} >
          {
            features.map((feature, i) => (
              featureList[i] && <View key={i} style={{ paddingHorizontal: 4, paddingVertical: 2, borderWidth: 0, marginRight: 10, borderRadius: 10, backgroundColor: feature.color, elevation: 4 }}>
                <Text>{feature.label}</Text>
              </View>
            ))
          }
        </ScrollView>

        <View style={{ flexDirection: "row", marginLeft: "2%" }}>
          {[...Array(5)].map((_, i) => (
            <Ionicons key={i} name="star" size={16} style={{
              marginRight: 6,
              color: i < rating ? "orange" : "gray"
            }} />
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
      }
    </View>
  );
}
