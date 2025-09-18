import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput, FlatList, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Appbar, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import debounce from "lodash.debounce";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { useLocation } from '../utils/locationService'

type FindWCProps = {
  route: {
    params: {
      washroomId?: number | null;
    };
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'FindWC'>;

export default function FindWC({ route, navigation }: Props) {
  
//export default function FindWC({ route }: FindWCProps) {

  const [washrooms, setWashrooms] = useState<Washroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [washroom, setWashroom] = useState<Washroom | null>(null);

  useFocusEffect(
    useCallback(() => {

      const wid = route?.params?.washroomId;
      // runs every time screen is focused
      //setName("Test Name " + wid);
      if (wid != null) {
        setLoading(true);
        axios.get(`http://192.168.43.233:8000/api/washrooms/${route.params.washroomId}/`)
          .then((response) => {
            const data: Washroom = response.data;
            setWashroom(data);
            setName(data.name)
            setDescription(data.description);
            setFeatureList([
              data.features.isDisableFriendly,
              data.features.isBabyFriendly,
              data.features.isPregnantFriendly,
            ]);
            setRating(data.avg_rating);
            setWashroomId(Number(data.id));
            setDestiLat(data.lat);
            setDestiLng(data.lng);
          })
          .catch((error) => {
            console.error("Error fetching data", error);
          })
          .finally(() => {
            setLoading(false);

          });
      }
      return () => {
        // cleanup when screen loses focus (optional)
      };
    }, [route.params?.washroomId])
  );

  // const wid = route?.params?.washroomId;

  // if (wid == null) {
  //   alert("No washroomId provided");
  // } else {
  //   alert("WashroomId:" + wid);
  // }


  type MapFilter = { label: string };

  let mapFilters: MapFilter[] = [
    { label: "All" },
    { label: "Disable friendly" },
    { label: "Baby friendly" },
    { label: "Pregnant friendly" }
  ]

  type FeatureLabel = {
    label: string,
    color: string
  }

  let featureLabels: FeatureLabel[] = [
    { label: "♿️ Wheelchair-accessible", color: "rgba(208,232,243, 1)" },
    { label: "👶 Baby-friendly", color: "rgba(223,203,243,1)" },
    { label: "🤰 Pregnancy-friendly", color: "rgba(233, 212, 216, 1)" },
  ];

  type Feature = {
    isDisableFriendly: boolean;
    isPregnantFriendly: boolean;
    isBabyFriendly: boolean;
  }

  type Washroom = {
    id: number;
    name: string;
    description: string;
    lat: number;
    lng: number;
    //reviews: Review[];
    features: Feature;
    avg_rating: number;
  }


  useEffect(() => {
    axios.get("http://192.168.43.233:8000/api/washrooms")
      .then((response) => {
        //alert(response.data[0].id)
        setWashrooms(response.data);
        // alert(response.data[0])

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

  const [washroomId, setWashroomId] = React.useState<number | null>();
  const [name, setName] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('');
  const [rating, setRating] = React.useState<number>(0);
  const [featureList, setFeatureList] = React.useState<boolean[]>([false, false, false]);
  const [destiLat, setDestiLat] = React.useState<number>(0);
  const [destiLng, setDestiLng] = React.useState<number>(0);


  type GoogleMapPlace = {
    name: string;
    lat: number;
    lng: number;
  }

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GoogleMapPlace[]>([]);
  const { location, fetchLocation } = useLocation();


  const fetchSuggestions = async (text: string) => {
    try {
      const res = await axios.get("http://192.168.43.233:8000/api/places", {
        params: { query: text }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  }

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 400), []);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch])

  const handleChange = (text: string) => {
    setQuery(text);

    if (text.length > 1) {
      debouncedFetch(text);
    } else {
      setSuggestions([]);
    }
  }

  const handleSelect = (place: GoogleMapPlace) => {
    setQuery(place.name);
    setSelectedMarker({ lat: place.lat, lng: place.lng });
    setSelectedWashroomId(null);
    mapRef.current?.animateToRegion(
      {
        latitude: place.lat,
        longitude: place.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // animation duration in ms
    );

    setSuggestions([]); //close suggestion dropdown

  }

  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedWashroomId, setSelectedWashroomId] = useState<number | null>(null);
  const mapRef = React.useRef<MapView>(null);


  //const selectedMarkerRef = React.useRef<null | (typeof Marker)>(null);
  const selectedMarkerRef = React.useRef<any>(null);
  useEffect(() => {
    selectedMarkerRef.current?.showCallout();
  }, [selectedMarker])

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // animation duration in ms
      );
    }
  }, [location]);

  //fetch current location after map load
  useEffect(() => {
    fetchLocation();
  }, [])

  //type FindWCNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindWC'>;

  //const navi = useNavigation<FindWCNavigationProp>();

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)" }}>
        <Appbar.Content title="" />
      </Appbar.Header>

      <TextInput
        placeholder="🔍 Type here to search...."
        value={query}
        onChangeText={handleChange}
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

      {suggestions.length > 0 && (
        <FlatList
          style={{
            position: "absolute",
            top: insets.top + 56 + 30, // just below TextInput
            width: "90%",
            backgroundColor: "white",
            borderRadius: 10,
            zIndex: 200,
            maxHeight: 250,
            marginHorizontal: "5%",
          }}
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSelect(item)}>
              <Text style={{ padding: 12, borderBottomWidth: 0.5, borderColor: "#ddd" }}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      )}


      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ height: 60, marginLeft: "2%", position: "absolute", marginTop: 56 + 25, zIndex: 2 }} contentContainerStyle={{
          paddingEnd: 10,
          alignItems: "center",


        }} >

        {
          mapFilters.map((mapFilter, i) => (
            <Pressable key={i} onPress={() => { setSelectedTab(i); }}>
              <View

                style={{
                  marginRight: i === mapFilters.length - 1 ? 0 : 10, // no margin after last item
                  borderRadius: 10,
                  backgroundColor: selectedTab === i ? "rgba(218, 254, 207, 1)" : "white",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  elevation: 4,

                }}
              >
                <Text>{mapFilter.label}</Text>
              </View>
            </Pressable>
          ))
        }

      </ScrollView>


      <MapView
        ref={mapRef}
        key={`map-${selectedTab}`} // force re-render when tab changes
        style={{ flex: 5, zIndex: 1 }}
        initialRegion={{
          latitude: location == null ? 3.139 : location.latitude,
          longitude: location == null ? 101.6869 : location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {
          selectedMarker && (
            <Marker
              ref={selectedMarkerRef}
              coordinate={{
                latitude: selectedMarker.lat,
                longitude: selectedMarker.lng
              }}
              pinColor="blue"
              title={"Currently searched Location"}
              description="Tap on nearby markers (washrooms)"
            />
          )}

        {washrooms
          .filter(washroom => {
            if (selectedTab === 0) return true;
            if (selectedTab === 1) return washroom.features.isDisableFriendly;
            if (selectedTab === 2) return washroom.features.isBabyFriendly;
            if (selectedTab === 3) return washroom.features.isPregnantFriendly;
            return false;
          })
          .map(washroom => (
            <Marker
              key={`${washroom.id}-${selectedWashroomId === washroom.id}`}
              coordinate={{ latitude: washroom.lat, longitude: washroom.lng }}
              // pinColor={
              //   route?.params?.washroomId === washroom.id
              //     ? "orange" // passed-in washroom
              //     : selectedWashroomId === washroom.id
              //       ? "green"  // tapped washroom
              //       : "red"    // others
              // }
              pinColor={
                selectedWashroomId === washroom.id
                  ? "green" // tapped washroom
                  : route?.params?.washroomId === washroom.id
                    ? "orange" // passed-in washroom
                    : "red"    // others
              }
              onPress={() => {
                setSelectedWashroomId(washroom.id);
                setName(washroom.name);
                setDescription(washroom.description);
                setFeatureList([
                  washroom.features.isDisableFriendly,
                  washroom.features.isBabyFriendly,
                  washroom.features.isPregnantFriendly,
                ]);
                setRating(washroom.avg_rating);
                setWashroomId(Number(washroom.id));
                setDestiLat(washroom.lat);
                setDestiLng(washroom.lng);
              }}
            />
          ))}
      </MapView>
      {name && <View style={{ padding: "2%", flexDirection: "column", position: "absolute", marginBottom: "2%", zIndex: 4, elevation: 10, bottom: 0, left: 0, right: 0, height: height * 0.3, backgroundColor: "white", marginHorizontal: "2%", borderRadius: 10 }}>

        {/* {location ? <Text>{location.latitude} | {location.longitude}</Text> : <Text>"DENIED"</Text>} */}

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
            featureLabels.map((featureLabel, i) => (
              featureList[i] && <View key={i} style={{ paddingHorizontal: 4, paddingVertical: 2, borderWidth: 0, marginRight: 10, borderRadius: 10, backgroundColor: featureLabel.color, elevation: 4 }}>
                <Text>{featureLabel.label}</Text>
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
            }]}
            onPress={() => washroomId != null ? navigation.navigate("WcDetails", { washroomId }) : null}

          >

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
            }]}
            onPress={() => washroomId != null ? navigation.navigate("Navigate", { washroomId, name, destiLat, destiLng }) : null}
          >

            <Ionicons name="navigate" size={16} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16 }}>Go There</Text>
          </Pressable>
        </View>

      </View>
      }

      <FAB
        icon="crosshairs-gps"
        style={{
          position: "absolute",
          bottom: (name ? height * 0.3 : 0) + insets.bottom + 20,
          right: 30,
          backgroundColor: "rgba(218, 254, 207, 1)",
        }}
        onPress={async () => {
          await fetchLocation(); // update state
          if (location && mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000 // ms
            );
          }
        }}
      />
    </View>
  );
}
