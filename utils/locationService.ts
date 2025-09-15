import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import GetLocation from 'react-native-get-location';

const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true;
};

export const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const fetchLocation = async () => {
        // Ask permission
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            alert('Permission Denied');
            return;
        }

        // get location
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then((loc) => {
                console.log(loc);
                setLocation({ latitude: loc.latitude, longitude: loc.longitude });
            })
            .catch((error) => {
                const { code, message } = error;
                console.warn(code, message);
                alert(message);
            });

        
    };

    return {location, fetchLocation}
}

