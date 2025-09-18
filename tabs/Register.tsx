import { View, Text, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, } from 'react-native';
import React, { useCallback, useState } from "react";
import { Appbar, TextInput } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import axios from 'axios';
import { showToast } from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {

    useFocusEffect(
        useCallback(() => {
            const logout = async () => {
                await AsyncStorage.setItem("userId", "");
                await AsyncStorage.setItem("userEmail", "");


                const id = await AsyncStorage.getItem("userId");
                const email = await AsyncStorage.getItem("userEmail");
                console.log("Loaded from storage:", id, email);
                alert(id);
                alert(email);
            };
            logout();
        }, [])
    );


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");

    const [isSubmiting, setIsSubmiting] = useState(false);
    type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Survey'>;

    const navigation = useNavigation<RegisterNavigationProp>();

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validatePassword = (password: string) => {
        if (password.length >= 8) return true;
        else return false;
    }

    const validateConfirmPassword = (confirmPassword: string) => {
        if (password === confirmPassword) return true;
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
        } else if (!validatePassword(password)) {
            setPasswordError(true);
            setPasswordErrorMsg("Password need to have at least 8 characters")
            setIsSubmiting(false)
            return;
        } else {
            setPassword(password);
            setPasswordError(false);
        }

        if (confirmPassword.trim() === "") {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMsg("Please confirm password.")
            setIsSubmiting(false)
            return;

        } else if (!validateConfirmPassword(confirmPassword)) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMsg("Password fields mismatch.")
            setIsSubmiting(false)
            return;

        } else {
            setConfirmPasswordError(false);
        }

        try {

            // console.log("Sending:", {
            //     email: email,
            //     password: password
            // });

            const res = await axios.post("http://192.168.43.233:8000/api/register/", {
                "email": email,
                "password": password
            })

            console.log(res.data)
            showToast("Register success");
            navigation.navigate("Home")

        } catch (err) {
            showToast("Email already in use");
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

            <View style={{ marginTop: 40, marginHorizontal: "5%" }}>
                <TextInput
                    secureTextEntry={true}
                    label={
                        <Text>
                            Confirm Password <Text style={{ color: "red" }}>*</Text>
                        </Text>
                    }
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={confirmPasswordError}
                    mode="outlined"
                />

            </View>

            <View style={{ marginTop: 20, marginBottom: 20, marginHorizontal: "5%" }}>
                {emailError && <Text style={{ color: "red" }}>* {emailErrorMsg}</Text>}
                {passwordError && <Text style={{ color: "red" }}>* {passwordErrorMsg}</Text>}
                {confirmPasswordError && <Text style={{ color: "red" }}>* {confirmPasswordErrorMsg}</Text>}

                <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                    onPress={() => handleSubmit()}
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
                                <Text style={{ fontSize: 16, marginLeft: 8, color: "white" }}>Registering... Please Wait...</Text>
                            </View>
                        ) : "Register"}
                    </Text>
                </Pressable>
            </View>


        </KeyboardAvoidingView>
    );
}
