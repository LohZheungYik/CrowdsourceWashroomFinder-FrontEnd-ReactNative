import { View, Text, Pressable, Platform, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from "@react-native-community/checkbox";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {showToast} from '../utils/toast';

type SurveyProps = {
    route: {
        params: {
            washroomId: number
        }
    }
}

export default function Survey({ route }: SurveyProps) {
    type Washroom = {
        name: string,
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

    // //onload function
    // useFocusEffect(
    //     useCallback(() => {
    //         const setStatus = async() => {
    //             alert("onload" + route.params.washroomId);
    //         }
    //         setStatus();

    //     }, [route.params.washroomId])
    // );



    const [rating, setRating] = React.useState(0);
    type Star = {
        rating: number
    }
    let stars = [{ rating: 1 }, { rating: 2 }, { rating: 3 }, { rating: 4 }, { rating: 5 },]

    const [checked, setChecked] = useState([false, false, false, false, false, false, false])

    const toggleCheckbox = (index: number) => {
        const updated = [...checked]; //shallow copy array
        updated[index] = !updated[index]; //flip value
        setChecked(updated);
    }

    type SurveyItem = { label: string }

    let surveyItems = [
        { label: "☹️ Locked" },
        { label: "☹️ Need request keys" },
        { label: "☹️ Long queue" },
        { label: "☹️ Feel insecure" },
        { label: "☹️ Not disabled/elderly friendly" },
        { label: "☹️ Not pregnant-friendly" },
        { label: "☹️ Not baby-friendly" },

    ]

    const [ratingError, setRatingError] = useState<string>("")

    type SurveyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Survey'>;

    const navigation = useNavigation<SurveyNavigationProp>();


    const handleSubmit = async () => {
        if (!washroom) return;
        if (rating == 0) {
            setRatingError("Please set a rating.")
            return;
        }

        const surveyData = {
            starRating: rating,
            isLocked: checked[0],
            isKeyNeeded: checked[1],
            isQueue: checked[2],
            isInsecure: checked[3],
            isElderHarsh: checked[4],
            isPregnantHarsh: checked[5],
            isBabyHarsh: checked[6],
            washroom_id: route.params.washroomId,

        };

        try {
            const response = await axios.post(
                "http://192.168.43.233:8000/api/reviews/",
                surveyData
            );

            showToast("Form submitted successfully!");

            setRating(0);
            setChecked([false, false, false, false, false, false, false]);
            setRatingError("");
            
            navigation.navigate("Home")

        } catch (error) {
            showToast("Form submission failed");

        }

    }

    

    return (
        <View style={{ flexDirection: "column", flex: 1, marginTop: 56 }}>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 55 }}>✅</Text>
            </View>
            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>You've Visited</Text>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>{washroom?.name}</Text>

            </View>


            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>

                {
                    stars.map((star, i) => (
                        <Pressable key={i} onPress={() => setRating(star.rating)}>
                            <Ionicons name="star" style={{
                                fontSize: 55,
                                color: (star.rating <= rating) ? "orange" : "black"
                            }}></Ionicons>
                        </Pressable>
                    ))

                }
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>Please tell us more...</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", flex: 4 }}>
                <View>
                    {checked.map((value, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                            <CheckBox value={value} onValueChange={() => toggleCheckbox(index)} />
                            <Text>{surveyItems[index].label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                    style={({ pressed }) => [{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 6,
                        paddingVertical: 4,
                        borderRadius: 15,
                        elevation: 4,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        backgroundColor: "rgba(146, 184, 82, 1)",
                        opacity: pressed ? 0.7 : 1,
                    }]}
                    onPress={handleSubmit}
                >

                    <Text style={{ fontSize: 32 }}>Done</Text>
                </Pressable>

            </View>


        </View>
    );
}
