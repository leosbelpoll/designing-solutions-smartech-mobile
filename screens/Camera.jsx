import React from "react";
import { View } from "react-native";
import { Camera } from "expo-camera";

export default function CameraScreen(props) {
    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}></Camera>
        </View>
    );
}

CameraScreen.navigationOptions = {
    name: "Camera"
};
