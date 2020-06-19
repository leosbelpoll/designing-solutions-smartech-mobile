import React, { useState } from "react";
import { Image, View, AsyncStorage } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles";
import { ACCESS_TOKEN_IDENTIFIER, USER_NAME } from "../configs";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

export default function Header(props) {
    const [menu, setMenu] = useState();

    const logout = () => {
        AsyncStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);
        AsyncStorage.removeItem(USER_NAME);
        props.navigation.navigate("Login");
    };

    const setMenuRef = (ref) => {
        setMenu(ref);
    };

    const showMenu = () => {
        menu.show();
    };

    return (
        <View style={styles.containerHeader}>
            <View>
                <Image
                    source={require("../assets/images/header-app.png")}
                    style={styles.imagenHeader}
                />
            </View>
            {!props.hideButtons && (
                <View>
                    <Menu
                        ref={setMenuRef}
                        button={
                            <View>
                                <MaterialCommunityIcons
                                    name="dots-vertical"
                                    size={24}
                                    color="black"
                                    onPress={showMenu}
                                />
                            </View>
                        }
                    >
                        <MenuItem
                            onPress={() => {
                                props.navigation.navigate("Projects");
                            }}
                        >
                            Inicio
                        </MenuItem>
                        <MenuItem onPress={() => {}}>Acerca de</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={logout}>Cerrar sesión</MenuItem>
                    </Menu>
                </View>
            )}
        </View>
    );
}
