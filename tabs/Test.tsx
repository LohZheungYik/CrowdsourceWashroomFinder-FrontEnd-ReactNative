import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import axios from "axios";

export default function Test() {
  

  type Washroom = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  
};

const [data, setData] = useState<Washroom[]>([]);      // holds API data
const [loading, setLoading] = useState(true); // for spinner

  useEffect(() => {
    // replace with your Django backend URL
    //  alert("TEST API")
    axios.get("http://192.168.43.233:8000/api/washrooms")
      .then((response) => {
        // alert(response.data[0].id)
        // alert(response.data[0].name)
        
        console.log(response.data)
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // hide spinner after request finishes
      });
  }, []);

  if (loading) {
    // show spinner while fetching
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
        
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>{item.name}</Text>
        </View>
      )}
    />
    </View>
  );

  
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});