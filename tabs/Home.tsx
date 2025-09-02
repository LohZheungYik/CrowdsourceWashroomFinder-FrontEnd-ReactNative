import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { FlatList, Image, ListRenderItem, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Home() {

  // const [location, setLocation] = React.useState<Location.LocationObject | null>(null);
  // const [loading, setLoading] = React.useState(true);

  //loading circle
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2)
  // }, []);

  //get current location
  // React.useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       return;
  //     }

  //     let loc = await Location.getCurrentPositionAsync({});
  //     setLocation(loc);
  //   })();
  // }, []);

  // let text = "waiting";
  // if (location) {
  //   text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  // }

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="green" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  type Item = {
    id: string;
    title: string;
    subtitle: string;
  }

  const data: Item[] = [
    { id: "1", title: "Item One", subtitle: "This is the first item" },
    { id: "2", title: "Item Two", subtitle: "This is the second item" },
    { id: "3", title: "Item Three", subtitle: "This is the third item" },
  ];

  type FeatureList = {
    name: string,
    image: number,
    color: string,
  }


  const featureList: FeatureList[] = [
    { name: "Find Washroom", image: require("../assets/images/wc.png"), color: "rgba(219, 249, 249, 1)" },
    { name: "Add Washroom", image: require("../assets/images/wc.png"), color: "rgba(218, 254, 207, 1)" },
    { name: "Share Washroom", image: require("../assets/images/wc.png"), color: "rgba(255, 231, 233, 1)" },
  ];

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity onPress={() => alert(`Clicked ${item.title}`)}>
        <Ionicons name="eye" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const SEARCH_HEIGHT = 50;
  const APPBAR_HEIGHT = 56;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flexDirection: "column", flex: 1, }}>

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

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: 100, marginTop: 50, flex: 1 }}>
        {
          featureList.map((_, i) => (
            <View key={i} style={{ flexDirection: "row-reverse", alignItems: "flex-end", borderRadius: 15, marginHorizontal: 10, backgroundColor: featureList[i].color, width: 250, height: 100, borderColor: "black", elevation: 24 }}>
              <Text style={{ zIndex: 2, position: "absolute", top: 0, left: 0, fontSize: 20, marginLeft: "5%", marginTop: "5%", fontWeight: "bold" }}>{featureList[i].name}</Text>
              <View style={{ zIndex: 1, position: "absolute", borderWidth: 0, borderColor: "black", width: "70%", height: "70%", marginBottom: "5%", opacity: 0.4 }}>
                <Image
                  source={featureList[i].image}
                  style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                />
              </View>
              <View style={{ zIndex: 2, borderWidth: 0, borderColor: "black", width: "40%", height: "50%", marginBottom: "5%" }}>
                <Image
                  source={require("../assets/images/wc.png")}
                  style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                />
              </View>
            </View>
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
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <View style={{ height: 20 }} />
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