import { View, ScrollView, Text, Dimensions, Image } from 'react-native';
import React from 'react';
import { Appbar } from 'react-native-paper';

export default function WcDetails() {

    const { width, height } = Dimensions.get("window");

    type ImageUrl = {
        url: number
    }

    let imageUrls : ImageUrl[] = [
        { url: require("../assets/images/wc2.png") },
        { url: require("../assets/images/wc2.png") },
        { url: require("../assets/images/wc2.png") },
        { url: require("../assets/images/wc2.png") },
        { url: require("../assets/images/wc2.png") }

    ]

    return (
        <ScrollView>
            <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)", }}>
                <Appbar.Content titleStyle={{ color: "white" }} title="Washroom Details" />

            </Appbar.Header>
            <View style={{ flexDirection: "row", marginHorizontal: "2%", marginVertical: 20}}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}
                    ellipsizeMode="tail" >TRX Premium Toilet TRX Premium Toilet TRX Premium Toilet</Text>
            </View>

            <ScrollView horizontal={true}>
                {
                    imageUrls.map((imgUrl, i) => (
                        <View key={i}>
                            <Image
                                source={imgUrl.url}
                                style={{ width: 300, height: 200, resizeMode: "contain", marginHorizontal: 2 }}
                            />
                        </View>
                    ))
                }
            </ScrollView>

            <View style={{ flexDirection: "row", marginHorizontal: "2%", marginVertical: 20}}>
                <Text style={{ fontSize: 15 }}
                    ellipsizeMode="tail">Ground floor near the chop shop Ground floor near the chop shop Ground floor near the chop shop</Text>
            </View>
        </ScrollView>
    );
}

