import { Image, View, ScrollView, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import React, { useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from "@react-native-community/checkbox";
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput, Button } from "react-native-paper";
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';


export default function AddWC() {

    //name, location detail, lat, lng, features

    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const mapRef = useRef<MapView>(null);

    const [name, setName] = React.useState("");
    const [nameError, setNameError] = React.useState(false);

    const [location, setLocation] = React.useState("");
    const [locationError, setLocationError] = React.useState(false);

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imagesError, setImagesError] = useState("");



    const { width, height } = Dimensions.get("window");

    const handleSubmit = () => {
        if (name.trim() === "") {
            setNameError(true);
        } else {
            setNameError(false);
            alert("Submitted Name : " + name);
        }

        if (location.trim() === "") {
            setLocationError(true);
        } else {
            setLocationError(false);
            alert("Submitted Location : " + location);
        }

    }

    const [checked, setChecked] = useState([false, false, false])

    const toggleCheckbox = (index: number) => {
        const updated = [...checked];
        updated[index] = !updated[index];
        setChecked(updated);
    }

    type CheckBoxItem = { label: string }

    let checkBoxItems: CheckBoxItem[] = [
        { label: "Disabled/elderly friendly" },
        { label: "Pregnant-friendly" },
        { label: "Baby-friendly" },

    ]

    //upload image start

    // Pick multiple images
    const pickImages = async () => {
        try {
            const picked = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
            });
            setImages(prev => prev.concat(picked));

        } catch (err) {
            console.log('Image pick cancelled or failed:', err);
        }
    };

    // Capture image with camera
    const pickFromCamera = async () => {
        try {
            const captured = await ImagePicker.openCamera({
                width: 800,         // optional resize
                height: 800,
                cropping: false,    // set true if you want crop UI
                mediaType: 'photo',
            });

            // `captured` is a single object, not an array like openPicker(multiple:true)
            setImages(prev => [...prev, captured]);
        } catch (err) {
            console.log("Camera cancelled or failed:", err);
        }
    };

    const uploadImages = async () => {
        if (images.length === 0) {
            setImagesError("Please upload at least one image");
            return;
        }
        setUploading(true);

        try {
            const res = await axios.post("http://192.168.43.233:8000/api/photos/get_signed_url/", {
                filenames: images.map(img => img.filename || img.path.split('/').pop()),
                content_types: images.map(img => img.mime || 'image/jpeg'),
            });

            const signedUrls = res.data;

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const { url, public_url } = signedUrls[i];

                // Fetch blob from local file
                const file = await fetch(image.path);
                const blob = await file.blob();

                await fetch(url, {
                    method: 'PUT',
                    body: blob,
                    headers: {
                        'Content-Type': image.mime || 'image/jpeg',
                    },
                });

                console.log('Uploaded:', public_url);
                alert('Upload complete!');
                setImages([]);
            }

        } catch (err) {
            console.log('Upload failed:', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    }

    //upload image end


    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: "rgba(77, 168, 87, 1)", }}>
                <Appbar.Content titleStyle={{ color: "white" }} title="Add Washroom" />

            </Appbar.Header>
            <ScrollView persistentScrollbar={true}>

                <View style={{ marginTop: 40, marginHorizontal: "5%" }}>
                    <TextInput
                        label={
                            <Text>
                                Name <Text style={{ color: "red" }}>*</Text>
                            </Text>
                        }
                        value={name}
                        onChangeText={setName}
                        error={nameError}
                        mode="outlined"
                    />
                </View>

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    <TextInput
                        label={
                            <Text>
                                Location Details <Text style={{ color: "red" }}>*</Text>
                            </Text>
                        }
                        value={location}
                        onChangeText={setLocation}
                        error={locationError}
                        mode="outlined"
                    />

                </View>

                <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginTop: 20, marginLeft: "5%", marginRight: "2%" }}>Tap the location on map</Text>
                    <Text style={{ marginTop: 20, color: "red" }}>*</Text>
                </View>

                <View>
                    <TextInput
                        style={{ marginHorizontal: "5%" }}
                        label="Type here to search"

                        mode="outlined"
                    />
                    <MapView
                        ref={mapRef}
                        style={{ marginHorizontal: "5%", height: height * 0.4 }}
                        initialRegion={{
                            latitude: 3.139, // Example: Kuala Lumpur
                            longitude: 101.6869,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        onPress={handleMapPress}
                    >
                        {selectedLocation && (
                            <Marker coordinate={selectedLocation} />
                        )}
                    </MapView>
                </View>

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    <TextInput
                        label={
                            <Text>
                                Latitude <Text style={{ color: "red" }}>*</Text>
                            </Text>
                        }
                        value={selectedLocation?.latitude.toFixed(6)}

                        mode="outlined"
                        disabled
                    />
                </View>

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    <TextInput
                        label={
                            <Text>
                                Longitude <Text style={{ color: "red" }}>*</Text>
                            </Text>
                        }
                        value={selectedLocation?.longitude.toFixed(6)}

                        mode="outlined"
                        disabled
                    />
                </View>

                {/* {selectedLocation && (
                    <View style={styles.infoBox}>
                        <Text>Latitude: {selectedLocation.latitude.toFixed(6)}</Text>
                        <Text>Longitude: {selectedLocation.longitude.toFixed(6)}</Text>
                    </View>
                )} */}

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    {checked.map((value, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                            <CheckBox value={value} onValueChange={() => toggleCheckbox(index)} />
                            <Text>{checkBoxItems[index].label}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    <Text>Upload Images (Max 5) <Text style={{ color: "red" }}>*</Text> </Text>
                </View>

                <View style={{ marginTop: 10, marginBottom: 20, marginHorizontal: "5%", flexDirection: "row" }}>
                    <Pressable android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                        onPress={pickImages}
                        style={({ pressed }) => [{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 15,
                            elevation: 4,
                            marginRight: 8,
                            backgroundColor: "rgba(218, 254, 207, 1)",
                            opacity: pressed ? 0.7 : 1,
                            flex: 1
                        }]}>

                        <Text style={{ fontSize: 16 }}>Choose From Gallery</Text>
                    </Pressable>

                    <Pressable
                        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
                        onPress={pickFromCamera}
                        style={({ pressed }) => [{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 15,
                            elevation: 4,
                            marginRight: 8,
                            backgroundColor: "rgba(218, 254, 207, 1)",
                            opacity: pressed ? 0.7 : 1,
                            flex: 1
                        }]}
                    >
                        <Text style={{ fontSize: 16 }}>Take Photo</Text>
                    </Pressable>
                </View>

                <ScrollView horizontal style={{ marginVertical: 16, marginHorizontal: "5%" }}>
                    {images.map((img, idx) => (
                        <View key={idx}>
                            <Pressable
                                onPress={() => {
                                    setImages(prev => prev.filter((_, i) => i !== idx));
                                }}
                                style={{ position: "absolute", zIndex: 2, right: "10%" }}
                            >
                                <View ><Text style={{ fontSize: 20 }}>❌</Text></View>
                            </Pressable>
                            <Image
                                key={idx}
                                source={{ uri: img.path }}
                                style={{ width: 100, height: 100, marginRight: 8 }}
                            />
                        </View>
                    ))}
                </ScrollView>

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
                            backgroundColor: "rgba(218, 254, 207, 1)",
                            opacity: pressed ? 0.7 : 1,
                        }]}>

                        <Text style={{ fontSize: 16 }}>Submit</Text>
                    </Pressable>
                </View>





            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    infoBox: {
        padding: 10,
        backgroundColor: "white",
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 8,
        elevation: 5,
    },
});