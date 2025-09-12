import { View, ScrollView, Text, Dimensions, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Appbar } from 'react-native-paper';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type WcDetailsProps = {
    route: {
        params: {
            washroomId: number;
        };
    };
};

export default function WcDetails({ route }: WcDetailsProps) {

    type Feature = {
        isDisableFriendly: boolean;
        isPregnantFriendly: boolean;
        isBabyFriendly: boolean;
    }

    type Washroom = {
        name: string,
        description: string,
        features: Feature,
        avg_rating: number,
        count_isLocked: number,
        count_isKeyNeeded: number,
        count_isQueue: number,
        count_isInsecure: number,
        count_isElderHarsh: number,
        count_isPregnantHarsh: number,
        count_isBabyHarsh: number
    }

    const [washroom, setWashroom] = useState<Washroom | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            axios.get(`http://192.168.43.233:8000/api/washrooms/${route.params.washroomId}/`)
                .then((response) => {
                    setWashroom(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching data", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, [route.params.washroomId])
    );

    const { width, height } = Dimensions.get("window");
    const { washroomId } = route.params;

    type ImageUrl = {
        url: { uri: string };
    }

    //alert(route.params.washroomId);

    let imageUrls: ImageUrl[] = [
        { url: { uri: "https://picsum.photos/id/1/300/200" } },
        { url: { uri: "https://picsum.photos/id/2/300/200" } },
        { url: { uri: "https://picsum.photos/id/3/300/200" } },
        { url: { uri: "https://picsum.photos/id/4/300/200" } },
        { url: { uri: "https://picsum.photos/id/5/300/200" } }
    ]

    type WCDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WcDetails'>;

    const navigation = useNavigation<WCDetailsNavigationProp>();

    type FeatureLabel = {
        label: string,
        color: string
    }

    let featureLabels: FeatureLabel[] = [
        { label: "♿️ Wheelchair-accessible", color: "rgba(208,232,243, 1)" },
        { label: "👶 Baby-friendly", color: "rgba(223,203,243,1)" },
        { label: "🤰 Pregnancy-friendly", color: "rgba(233, 212, 216, 1)" },
    ];

    let featureList = [washroom?.features.isDisableFriendly, washroom?.features.isBabyFriendly, washroom?.features.isPregnantFriendly];

    return (
        washroom != null ? <ScrollView>
            <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)", }}>
                <Appbar.BackAction onPress={() => navigation.navigate("FindWC")} color="white" />
                <Appbar.Content titleStyle={{ color: "white" }} title="Washroom Details" />

            </Appbar.Header>
            <View style={{ flexDirection: "row", marginHorizontal: "2%", marginTop: 20}}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}
                    ellipsizeMode="tail" >{washroom.name}</Text>
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

            <View style={{ flexDirection: "row", marginLeft: "2%", marginBottom: 20 }}>
                {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} style={{
                        marginRight: 6,
                        color: i < washroom.avg_rating ? "orange" : "gray"
                    }} />
                ))}
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

            <View style={{ flexDirection: "row", marginHorizontal: "2%", marginVertical: 20 }}>
                <Text style={{ fontSize: 15 }}>{washroom.description}</Text>
            </View>

            <View style={{ marginHorizontal: "2%" }}>
                {
                    washroom.count_isLocked > 10 ||
                        washroom.count_isKeyNeeded > 10 ||
                        washroom.count_isQueue > 10 ||
                        washroom.count_isInsecure > 10 ||
                        washroom.count_isElderHarsh > 10 ||
                        washroom.count_isPregnantHarsh > 10 ||
                        washroom.count_isBabyHarsh > 10 ?
                        <Text style={{ fontSize: 20 }}>⚠️ Things to watch out</Text>
                        : <></>
                }
            </View>

            {
                washroom.count_isLocked > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report it is locked</Text>
                    : <></>
            }

            {
                washroom.count_isKeyNeeded > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report key request is needed </Text>
                    : <></>
            }

            {
                washroom.count_isQueue > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report queue is needed </Text>
                    : <></>
            }

            {
                washroom.count_isInsecure > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report it is insecure </Text>
                    : <></>
            }

            {
                washroom.count_isElderHarsh > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report it is not elder-friendly </Text>
                    : <></>
            }

            {
                washroom.count_isPregnantHarsh > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report it is not pregnant-friendly </Text>
                    : <></>
            }

            {
                washroom.count_isBabyHarsh > 10 ?
                    <Text style={{ marginHorizontal: "2%", marginVertical: 5, fontSize: 15 }}>🙁 Past users report it is not baby-friendly </Text>
                    : <></>
            }





        </ScrollView> : <></>
    );
}

