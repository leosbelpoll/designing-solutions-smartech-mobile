import React from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function Footer() {
    return (
        <>
        <View style={stylesFooter.containerFooter}>
            <TouchableOpacity style={stylesFooter.iconFooter}>
                <FontAwesome name="facebook" size={24} color="#4f5b84" />
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooter.iconFooter}>
                <FontAwesome name="twitter" size={24} color="#4f5b84" />
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooter.iconFooter}>
                <FontAwesome name="instagram" size={24} color="#4f5b84" />
            </TouchableOpacity>
        </View>
        </>
    )
}

const stylesFooter = StyleSheet.create({
  containerFooter: {
    position: "absolute",
    bottom: 20,
    left: 20,
    display: "flex",
    flexDirection: "column",
    // backgroundColor: COLOR_LIGHT_GREY,
    padding: 10,
    paddingTop: 20,
    borderRadius: 30,
  },
  iconFooter: {
    paddingBottom: 8,
  }
});
