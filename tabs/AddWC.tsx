import { Image, View, ScrollView, Text, Pressable, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from "@react-native-community/checkbox";
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput, Button } from "react-native-paper";
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import debounce from 'lodash.debounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageResizer from '@bam.tech/react-native-image-resizer';
export default function AddWC() {

    //name, location detail, lat, lng, features
    const [name, setName] = React.useState("");
    const [nameError, setNameError] = React.useState(false);

    const [locationDetails, setLocationDetails] = useState("");
    const [locationDetailsError, setLocationDetailsError] = useState(false);
    const insets = useSafeAreaInsets();

    type GoogleMapPlace = {
        name: string;
        lat: number;
        lng: number;
    }

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<GoogleMapPlace[]>([]);

    const fetchSuggestions = async (text: string) => {
        try {
            const res = await axios.get("http://192.168.43.233:8000/api/places", {
                params: { query: text }
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
        }
    }

    const debouncedFetch = useCallback(debounce(fetchSuggestions, 400), []);

    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch])

    const handleChange = (text: string) => {
        setQuery(text);

        if (text.length > 1) {
            debouncedFetch(text);
        } else {
            setSuggestions([]);
        }
    }

    const handleSelect = (place: GoogleMapPlace) => {
        setQuery(place.name);
        // setSelectedMarker({ lat: place.lat, lng: place.lng });

        mapRef.current?.animateToRegion(
            {
                latitude: place.lat,
                longitude: place.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            1000 // animation duration in ms
        );

        setSuggestions([]); //close suggestion dropdown

    }

    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedLocationError, setSelectedLocationError] = useState(false);
    const mapRef = useRef<MapView>(null);




    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imagesError, setImagesError] = useState(false);

    const [wcFeatures, setWcFeatures] = useState([false, false, false])

    const toggleCheckbox = (index: number) => {
        const updated = [...wcFeatures];
        updated[index] = !updated[index];
        setWcFeatures(updated);
    }

    type CheckBoxItem = { label: string }

    let checkBoxItems: CheckBoxItem[] = [
        { label: "Disabled/elderly friendly" },
        { label: "Pregnant-friendly" },
        { label: "Baby-friendly" },

    ]

    const { width, height } = Dimensions.get("window");

    const handleSubmit = async () => {
        setUploading(true);

        if (name.trim() === "") {
            setNameError(true);
            return;
        } else {
            setNameError(false);
        }

        if (locationDetails.trim() === "") {
            setLocationDetailsError(true);
            return;
        } else {
            setLocationDetailsError(false);
        }

        if (selectedLocation === null) {
            setSelectedLocationError(true);
            return;
        } else {
            setSelectedLocationError(false);
        }



        let imageUrls = await uploadImages();
        //why imageUrls undefined?
        if (!imageUrls || imageUrls.length === 0) {
            
            setImagesError(true);
            return;
        }
        let wcData = {
            name: name,
            description: locationDetails,
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
            features: {
                isDisableFriendly: wcFeatures[0],
                isPregnantFriendly: wcFeatures[1],
                isBabyFriendly: wcFeatures[2]
            },
            photos: imageUrls
        }
        
        //how to write wcData post code axios
        try {
            const res = await axios.post("http://192.168.43.233:8000/api/washrooms/", wcData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("WC posted:", res.data);
        } catch (err) {
            console.error("Error posting washroom:", err);
            alert("Failed to submit washroom.");
        } finally {
            setUploading(false);
        }

    }

    const uploadImages = async () => {
        if (images.length === 0 || images.length > 5) {
            setImagesError(true);
            return;
        } else {
            setImagesError(false);
        }


        let imageUrls = []

        try {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                //resize
                const resizedImage = await ImageResizer.createResizedImage(
                    image.path,   // original image path
                    300,          // width
                    200,          // height
                    'JPEG',       // format
                    80            // quality (0-100)
                );

                // 1. Get a signed URL for this image
                const res = await axios.get("http://192.168.43.233:8000/api/photos/get_signed_url/");
                const { upload_url, public_url } = res.data;

                // 2. Convert file to blob
                const file = await fetch(resizedImage.uri);
                const blob = await file.blob();

                // 3. Upload to Google Cloud Storage
                await fetch(upload_url, {
                    method: 'PUT',
                    body: blob,
                    headers: { 'Content-Type': 'image/jpeg' },
                });

                console.log("Uploaded:", public_url);
                imageUrls.push({ photoUrl: public_url })

            }

            return imageUrls;

        } catch (err) {
            console.log('Upload failed:', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
            
        }
    }




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
                                Washroom Location Name <Text style={{ color: "red" }}>*</Text>
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
                        value={locationDetails}
                        onChangeText={setLocationDetails}
                        error={locationDetailsError}
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
                        label="🔍 Move the map by searching here."
                        value={query}
                        onChangeText={handleChange}
                        mode="outlined"
                    />

                    {suggestions.length > 0 && (
                        <FlatList
                            scrollEnabled={false}
                            nestedScrollEnabled={true}
                            style={{
                                position: "absolute",
                                top: insets.top + 56 + 30, // just below TextInput
                                width: "90%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                zIndex: 200,
                                maxHeight: 250,
                                marginHorizontal: "5%",
                            }}
                            data={suggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => handleSelect(item)}>
                                    <Text style={{ padding: 12, borderBottomWidth: 0.5, borderColor: "#ddd" }}>
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                        />
                    )}
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
                        error={selectedLocationError}
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
                        error={selectedLocationError}

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
                    {wcFeatures.map((value, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                            <CheckBox value={value} onValueChange={() => toggleCheckbox(index)} />
                            <Text>{checkBoxItems[index].label}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 20, marginHorizontal: "5%" }}>
                    <Text>Upload Images (Max 5) <Text style={{ color: "red" }}>*</Text> </Text>
                </View>

                <View style={{ marginTop: 10, marginHorizontal: "5%", flexDirection: "row" }}>
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
                            flex: 2
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

                <ScrollView horizontal style={{ marginTop: 10, marginHorizontal: "5%" }}>
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
                <View style={{ marginTop: 10, marginHorizontal: "5%" }}>
                    {nameError && <Text style={{ color: "red" }}>* Washroom location name is required</Text>}
                    {locationDetailsError && <Text style={{ color: "red" }}>* Location details required</Text>}
                    {selectedLocationError && <Text style={{ color: "red" }}>* Please tap on the map to mark location (lat & lng)</Text>}
                    {imagesError && <Text style={{ color: "red" }}>* A minimum of 1 image and a maximum of 5 images are allowed</Text>}
                </View>
                <View style={{ marginTop: 20, marginBottom: 20, marginHorizontal: "5%" }}>
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
                            backgroundColor: "rgba(218, 254, 207, 1)",
                            opacity: pressed ? 0.7 : 1,
                        }]}>

                        <Text style={{ fontSize: 16 }}> {uploading ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator size="small" color="black" />
                                <Text style={{ fontSize: 16, marginLeft: 8 }}>Submiting... Please Wait...</Text>
                            </View>
                        ) : "Submit"} </Text>
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