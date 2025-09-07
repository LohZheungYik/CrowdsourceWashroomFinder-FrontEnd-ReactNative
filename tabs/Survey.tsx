import { View, Text, Pressable } from 'react-native';
import React, { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from "@react-native-community/checkbox";

export default function Survey() {
    const [rating, setRating] = React.useState(-1);
    type Star = {
        rating: number
    }
    let stars = [{ rating: 0 }, { rating: 1 }, { rating: 2 }, { rating: 3 }, { rating: 4 },]

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

    return (
        <View style={{ flexDirection: "column", flex: 1, marginTop: 56}}>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Text style={{fontWeight: "bold", fontSize: 55}}>✅</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Text style={{fontWeight: "bold", fontSize: 25}}>You've Arrived</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>

                {
                    stars.map((star, i) => (
                        <Pressable key={i} onPress={() => setRating(i)}>
                            <Ionicons name="star" style={{
                                fontSize: 55,
                                color: (i <= rating) ? "orange" : "black"
                            }}></Ionicons>
                        </Pressable>
                    ))

                }
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flex: 1 }}>
                <Text style={{fontWeight: "bold", fontSize: 25}}>Please tell us more...</Text>
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
                    }]}>

                    <Text style={{ fontSize: 32 }}>Done</Text>
                </Pressable>

            </View>


        </View>
    );
}
