import { View, Text, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, } from 'react-native';
import React, { useCallback, useState } from "react";
import { Appbar, TextInput } from 'react-native-paper';
import axios from 'axios';
import { showToast } from '../utils/toast';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Globals } from '../utils/globals'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {

    useFocusEffect(
        useCallback(() => {
            const logout = async () => {
                await AsyncStorage.setItem("userId", "");
                await AsyncStorage.setItem("userEmail", "");


                const id = await AsyncStorage.getItem("userId");
                const email = await AsyncStorage.getItem("userEmail");
                console.log("Loaded from storage:", id, email);
                // alert(id);
                // alert(email);
            };
            logout();
        }, [])
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

    const [isSubmiting, setIsSubmiting] = useState(false);

    type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<LoginNavigationProp>();


    type User = {
        id: number,
        email: string,

    }

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validatePassword = (password: string) => {
        if (password.length >= 8) return true;
        else return false;
    }

    const handleSubmit = async () => {
        setIsSubmiting(true);

        if (email.trim() === "") {
            setEmailError(true);
            setEmailErrorMsg("E-mail address is required")
            setIsSubmiting(false)
            return;
        } else if (!validateEmail(email)) {
            setEmailError(true);
            setEmailErrorMsg("Invalid E-mail address format")
            setIsSubmiting(false)
            return;
        } else {
            setEmail(email);
            setEmailError(false);
        }

        if (password.trim() === "") {
            setPasswordError(true);
            setPasswordErrorMsg("Password is required")
            setIsSubmiting(false)
            return;
        } else {
            setPassword(password);
            setPasswordError(false);
        }

        try {

            // console.log("Sending:", {
            //     email: email,
            //     password: password
            // });

            const res = await axios.post("http://192.168.43.233:8000/api/login/", {
                "email": email,
                "password": password
            })

            console.log(res.data)
            showToast("Login success");

            let user: User = res.data.user
            console.log(user)
            await AsyncStorage.setItem("userId", String(user.id));
            await AsyncStorage.setItem("userEmail", user.email);

            //navigation.navigate("Home")

            navigation.navigate("Tabs", {
                screen: "Home",
                
            });

        } catch (err) {
            showToast("Invalid email or password");
        } finally {
            setIsSubmiting(false);
        }




    }

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
                            E-mail <Text style={{ color: "red" }}>*</Text>
                        </Text>
                    }
                    value={email}
                    onChangeText={setEmail}
                    error={emailError}
                    mode="outlined"
                />

            </View>

            <View style={{ marginTop: 40, marginHorizontal: "5%" }}>
                <TextInput
                    secureTextEntry={true}
                    label={
                        <Text>
                            Password <Text style={{ color: "red" }}>*</Text>
                        </Text>
                    }
                    value={password}
                    onChangeText={setPassword}
                    error={passwordError}
                    mode="outlined"
                />

            </View>

            <View style={{ marginTop: 20, marginBottom: 20, marginHorizontal: "5%" }}>
                {emailError && <Text style={{ color: "red" }}>* {emailErrorMsg}</Text>}
                {passwordError && <Text style={{ color: "red" }}>* {passwordErrorMsg}</Text>}

                <Pressable
                    onPress={() => handleSubmit()}
                    android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
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

                    <Text style={{ color: "white", fontSize: 16 }}>
                        {isSubmiting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator size="small" color="white" />
                                <Text style={{ fontSize: 16, marginLeft: 8, color: "white" }}>Login In... Please Wait...</Text>
                            </View>
                        ) : "Login"}
                    </Text>
                </Pressable>
            </View>

            <View
                style={{
                    height: 1, // thinnest line per device
                    backgroundColor: "#ccc",          // light gray
                    marginVertical: 10,               // spacing
                }}
            />

            <View style={{ marginTop: 20, marginBottom: 20, marginHorizontal: "5%" }}>

                <Pressable
                    onPress={() => { navigation.navigate("Register"); }}
                    android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                    style={({ pressed }) => [{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 15,
                        elevation: 4,
                        marginRight: 8,
                        backgroundColor: "rgba(154, 228, 132, 1)",
                        opacity: pressed ? 0.7 : 1,
                    }]}>

                    <Text style={{ color: "black", fontSize: 16 }}>Register</Text>
                </Pressable>
            </View>


        </KeyboardAvoidingView >
    );
}
