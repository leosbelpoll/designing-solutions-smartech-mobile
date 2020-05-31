import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, AsyncStorage, View, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../styles";

import { API_URL, ACCESS_TOKEN_IDENTIFIER, USER_NAME, PUSH_NOTIFICATION_TOKEN } from "../configs";
import Loading from "./Loading";
import Header from "../components/Header";

export default function Login(props) {
    const [error, setError] = useState();
    const [connectionError, setConnectionError] = useState();
    const [validating, isValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const { route } = props;

    const onLogin = async () => {
        if (!username || !password) {
            isValidating(true);
            return;
        }
        isValidating(false);
        setLoading(true);
        setError(null);
        fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then(async (res) => {
                if (res.error === "Unauthorized") {
                    setError("Unauthorized");
                    setLoading(false);
                } else {
                    setUsername("");
                    setPassword("");
                    setError(null);
                    AsyncStorage.setItem(ACCESS_TOKEN_IDENTIFIER, res["access_token"]);
                    AsyncStorage.setItem(USER_NAME, username);
                    setPushNotificationToken();
                    setLoading(false);
                    props.navigation.navigate("Projects");
                }
            })
            .catch((err) => {
                setLoading(false);
                setConnectionError(err);
            });
    };

    const setPushNotificationToken = async () => {
        const apiToken = await AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
        const username = await AsyncStorage.getItem(USER_NAME);
        const pushNotificationToken = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN);
        
        if (apiToken && pushNotificationToken && username) {
            setLoading(true);
            fetch(`${API_URL}/set-push-notification-token`, {
                method: "POST",
                body: JSON.stringify({
                    username,
                    token: pushNotificationToken
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    const checkUser = async () => {
        const apiToken = await AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
        if (apiToken) {
            setLoading(true);
            fetch(`${API_URL}/version`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    if (!["Unauthorized.", "Unauthenticated."].includes(res.message)) {
                        props.navigation.navigate("Projects");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        setPushNotificationToken()
        checkUser();
    }, [route]);

    if (loading) {
        return <Loading />;
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingTop: 0
            }}
        >
            <Header {...props} hideButtons={true} />
            {error && (
                <Text style={styles.notificationError} onPress={() => setError(null)}>
                    Usuario o contraseña incorrecta.
                </Text>
            )}
            {connectionError && (
                <Text style={styles.notificationError} onPress={() => setError(null)}>
                    Ha ocurrido un error de red.
                </Text>
            )}
            {validating && (!username || !password) && (
                <Text style={styles.notificationError} onPress={() => isValidating(false)}>
                    Valide los campos del formulario.
                </Text>
            )}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text style={styles.title}> Inicio de Sesión </Text>
                    <TextInput
                        style={validating && !username ? styles.inputError : styles.inputs}
                        placeholder="Usuario"
                        onChangeText={(text) => {
                            setUsername(text);
                            setError(null);
                        }}
                        value={username}
                    />
                    {validating && !username && <Text style={styles.textError}>Campo requerido</Text>}
                    <TextInput
                        style={[validating && !password ? styles.inputError : styles.inputs, { marginTop: 20 }]}
                        placeholder="Contraseña"
                        secureTextEntry={true}
                        onChangeText={(pass) => {
                            setPassword(pass);
                            setError(null);
                        }}
                        value={password}
                    />
                    {validating && !password && <Text style={styles.textError}>Campo requerido</Text>}
                    <TouchableOpacity style={styles.buttom} onPress={() => onLogin()}>
                        <Text style={styles.textButton}>{loading ? "Loading ..." : "Iniciar Sesión"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

Login.navigationOptions = {
    name: "Login"
};
