import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loading(props) {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={true}
                color="green"
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 70,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 80,
    },
});
