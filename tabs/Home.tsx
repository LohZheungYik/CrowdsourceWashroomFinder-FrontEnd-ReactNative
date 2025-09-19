import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ListRenderItem, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocation } from '../utils/locationService'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Globals } from '../utils/globals'
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Home() {

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const id = await AsyncStorage.getItem("userId");
        const email = await AsyncStorage.getItem("userEmail");
        console.log("Loaded from storage:", id, email);
        alert(id);
        alert(email);
      };
      loadUser();
    }, [])
  );


  // //get current location
  const { location, fetchLocation } = useLocation();
  useEffect(() => {
    fetchLocation();

  }, [])


  type Feature = {
    isDisableFriendly: boolean;
    isPregnantFriendly: boolean;
    isBabyFriendly: boolean;
  }

  type Photo = {
    photoUrl: string
  }

  type Washroom = {
    id: number,
    name: string,
    description: string,
    features: Feature,
    avg_rating: number,
    photos: Photo[]
  }

  const [loading, setLoading] = useState(true);
  const [washrooms, setWashrooms] = useState<Washroom[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      axios
        .get("http://192.168.43.233:8000/api/washrooms/get_nearest_toilets", {
          params: {
            lat: location == null ? 2.9431399 : location.latitude,
            lng: location == null ? 101.7190007 : location.longitude,

            //2.9431399 Longitude: 101.7190007
          },
        })
        .then((response) => {
          setWashrooms(response.data);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        })
        .finally(() => {
          setLoading(false);
        });

      // return cleanup (if needed)
      return () => {
        setWashrooms([]);
      };
    }, [location])
  );

  // const washrooms: Washroom[] = [
  //   {id: 1, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 2, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 4, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 5, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 6, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 7, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 8, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 9, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 10, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 11, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 12, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},
  //   {id: 13, name : "i2", avg_rating: 4, description: "", features: {isBabyFriendly: false, isDisableFriendly: false, isPregnantFriendly: false}, photos: []},

  // ]



  // const data: Item[] = [
  //   { id: "1", title: "Item One", subtitle: "This is the first item" },
  //   { id: "2", title: "Item Two", subtitle: "This is the second item" },
  //   { id: "3", title: "Item Three", subtitle: "This is the third item" },
  // ];



  type FeatureList = {
    name: string,
    image: number,
    color: string,
  }

  

  const featureList: FeatureList[] = [
    { name: "Find Washroom", image: require("../assets/images/wc.png"), color: "rgba(219, 249, 249, 1)" },
    { name: "Add Washroom", image: require("../assets/images/wc.png"), color: "rgba(218, 254, 207, 1)" },
  ];



  const renderWashrooms: ListRenderItem<Washroom> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={[styles.subtitle, { flexDirection: "row", marginLeft: "2%" }]}>
          {[...Array(5)].map((_, i) => (
            <Ionicons key={i} name="star" size={16} style={{
              marginRight: 6,
              color: i < item.avg_rating ? "orange" : "gray"
            }} />
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        let washroomId = item.id;
        //navigation.navigate("FindWC", { washroomId })
        //navigation.navigate("FindWC", { washroomId: item.id });

        navigation.navigate("Tabs", {
          screen: "Find Washroom",
          params: { washroomId: item.id },
        });
      }}>
        <Ionicons name="eye" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const SEARCH_HEIGHT = 50;
  const APPBAR_HEIGHT = 56;
  const insets = useSafeAreaInsets();

  type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
  const navigation = useNavigation<HomeNavigationProp>();
  
  
  
  return (
    <SafeAreaView style={{ flexDirection: "column", flex: 1, }}>

      <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)" }}>
        <Appbar.Content title="" />
      </Appbar.Header>
      <Pressable
        onPress={() =>
          navigation.navigate("Tabs", {
            screen: "Find Washroom",
            //params: { washroomId: null },
          })
        }
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
          justifyContent: "center",
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ color: "gray" }}>🔍 Type here to search....</Text>
      </Pressable>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 100, marginTop: 50, flex: 1 }}>
        {
          featureList.map((_, i) => (
            <Pressable key={i}
              style = {({pressed}) => [{
                opacity: pressed ? 0.7 : 1,
              }]}
              onPress={() =>
                navigation.navigate("Tabs", {
                  screen: "Find Washroom",
                  // params: { washroomId: null },
                })
              }>
              <View style={{ flexDirection: "row-reverse", alignItems: "flex-end", borderRadius: 15, marginHorizontal: 10, backgroundColor: featureList[i].color, width: 250, height: 100, borderColor: "black", elevation: 24 }}>
                <Text style={{ zIndex: 2, position: "absolute", top: 0, left: 0, fontSize: 20, marginLeft: "5%", marginTop: "5%", fontWeight: "bold" }}>{featureList[i].name}</Text>
                <View style={{ zIndex: 1, position: "absolute", borderWidth: 0, borderColor: "black", width: "70%", height: "70%", marginBottom: "5%", opacity: 0.4 }}>
                  <Image
                    source={featureList[i].image}
                    style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                  />
                </View>
                <View style={{ zIndex: 2, borderWidth: 0, borderColor: "black", width: "40%", height: "50%", marginBottom: "5%" }}>
                  <Image
                    source={featureList[i].image}
                    style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                  />
                </View>
              </View>
            </Pressable>
          ))
        }
      </ScrollView>

      <View
        style={{

          borderRadius: 15,
          elevation: 24,
          overflow: "hidden",
          backgroundColor: "white",
          marginHorizontal: "5%",
          flex: 4

        }}
      >
        <FlatList
          data={washrooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWashrooms}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={<View style={{ paddingLeft: "5%", paddingTop: "3%" }}>
            <Text style={{ fontWeight: "bold", color: "gray" }}>Nearby Washrooms</Text>
          </View>}
        />
      </View>
      <View style={{ height: 20 }} />
      <FAB
        icon="refresh"
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "rgba(218, 254, 207, 1)",
        }}
        onPress={fetchLocation}
      />
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: "gray",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});