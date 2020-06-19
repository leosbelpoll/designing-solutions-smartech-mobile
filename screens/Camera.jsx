import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";

import { Ionicons } from "@expo/vector-icons";
import Loading from "./Loading";

export default function CameraScreen(props) {
    const { operation } = props.route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 1 }}
                type={type}
                ref={(ref) => {
                    setCameraRef(ref);
                }}
                ratio={"16:9"}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        justifyContent: "flex-end",
                    }}
                >
                    {loading && (
                        <View
                            style={{
                                marginBottom: -40,
                                marginRight: 100,
                                alignSelf: "flex-end",
                            }}
                        >
                            <ActivityIndicator animating={true} color="white" size="large" />
                        </View>
                    )}
                    <TouchableOpacity
                        style={{
                            marginBottom: -50,
                            marginLeft: 100,
                        }}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                            );
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                            <Ionicons name="md-reverse-camera" size={30} color="white" />
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ alignSelf: "center", marginBottom: 40 }}
                        onPress={async () => {
                            if (cameraRef) {
                                setLoading(true);
                                const photo = await cameraRef.takePictureAsync({
                                    quality: 0.5,
                                });
                                operation(photo.uri);
                                setLoading(false);
                                props.navigation.goBack();
                            }
                        }}
                    >
                        <View
                            style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: "white",
                                height: 50,
                                width: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    borderColor: "white",
                                    height: 40,
                                    width: 40,
                                    backgroundColor: "white",
                                }}
                            ></View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

CameraScreen.navigationOptions = {
    name: "Camera",
};
