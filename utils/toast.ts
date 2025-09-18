import { Platform, ToastAndroid } from "react-native";

export const showToast = (message: string) => {
    if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        // fallback for iOS
        console.log(message);
    }
};