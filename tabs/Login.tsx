import { View, Text, Pressable, KeyboardAvoidingView, Platform, } from 'react-native';
import React, { useState } from "react";
import { Appbar, TextInput } from 'react-native-paper';

export default function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);


    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "rgba(218, 254, 207, 1)" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"} // padding for iOS, height for Android
        >
            <Appbar.Header style={{ backgroundColor: "rgba(218, 254, 207, 1)" }}>
                <Appbar.Content titleStyle={{ color: "white", textAlign: "center" }} title="" />

            </Appbar.Header>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 30 }}>🧻📞 NatureCall</Text>
            </View>

            <View style={{ marginTop: 40, marginHorizontal: "5%" }}>
                <TextInput
                    label={
                        <Text>
                            User Name <Text style={{ color: "red" }}>*</Text>
                        </Text>
                    }
                    value={userName}
                    onChangeText={setUserName}
                    error={userNameError}
                    mode="outlined"
                />

            </View>

            <View style={{ marginTop: 40, marginHorizontal: "5%" }}>
                <TextInput
                    label={
                        <Text>
                            Password <Text style={{ color: "red" }}>*</Text>
                        </Text>
                    }
                    value={userName}
                    onChangeText={setPassword}
                    error={passwordError}
                    mode="outlined"
                />

            </View>

            <View style={{ marginTop: 20, marginBottom: 20, marginHorizontal: "5%" }}>
                <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                    style={({ pressed }) => [{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 15,
                        elevation: 4,
                        marginRight: 8,
                        backgroundColor: "rgba(65, 150, 39, 1)",
                        opacity: pressed ? 0.7 : 1,
                    }]}>

                    <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
                </Pressable>
            </View>


        </KeyboardAvoidingView>
    );
}
