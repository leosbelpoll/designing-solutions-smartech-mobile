import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function HelpIcon(props) {
    return (
        <>
            <View style={stylesHelpIcon.containerHelpIcon}>
                <TouchableOpacity
                    style={stylesHelpIcon.iconHelpIcon}
                    onPress={() => {
                        props.navigation.navigate("Help");
                    }}
                >
                    <FontAwesome name="help" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const stylesHelpIcon = StyleSheet.create({
    containerHelpIcon: {
        position: "absolute",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "black",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
});
