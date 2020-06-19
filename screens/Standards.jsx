import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, AsyncStorage, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../styles";
import { ACCESS_TOKEN_IDENTIFIER, API_URL, USER_NAME } from "../configs";
import Header from "../components/Header";
import Loading from "./Loading";
import HelpIcon from "../components/HelpIcon";

export default function Standards(props) {
    const [screenTitle, setScreenTitle] = useState();
    const [standards, setStandards] = useState();
    const { project } = props.route.params;
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);

    const fetchMyAPI = async () => {
        setLoading(true);
        AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
            .then((token) => {
                fetch(`${API_URL}/standards?project=${project.id}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (["Unauthorized.", "Unauthenticated."].includes(res.message)) {
                            AsyncStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);
                            AsyncStorage.removeItem(USER_NAME);
                            props.navigation.navigate("Login", {
                                notification: {
                                    type: "error",
                                    message: "Ingrese nuevamente por favor",
                                },
                            });
                        } else {
                            setStandards(res.standards);
                            setScreenTitle(res.project.next_screen_title);
                            setLoading(false);
                        }
                    });
            })
            .done();
    };

    const onClick = (standard) => {
        setLoading(true);
        setApiError(null);
        AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
            .then((token) => {
                fetch(`${API_URL}/standards/${standard.id}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (["Unauthorized.", "Unauthenticated."].includes(res.message)) {
                            AsyncStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);
                            AsyncStorage.removeItem(USER_NAME);
                            props.navigation.navigate("Login", {
                                notification: {
                                    type: "error",
                                    message: "Ingrese nuevamente por favor",
                                },
                            });
                        } else if (res.error) {
                            setApiError(res.error);
                        } else {
                            if (res.standards && res.standards.length) {
                                setScreenTitle(res.next_screen_title);
                                setStandards(res.standards);
                            } else {
                                if (standard.type === "FORM") {
                                    props.navigation.navigate("Form", {
                                        standard: res,
                                        project,
                                        notification: null,
                                    });
                                } else if (standard.type === "VEHICLE") {
                                    props.navigation.navigate("Vehicle", {
                                        standard: res,
                                        project,
                                    });
                                } else {
                                    Alert.alert("Esta función no tiene tipo.");
                                }
                            }
                        }
                    })
                    .finally(() => setLoading(false));
            })
            .done();
    };

    useEffect(() => {
        fetchMyAPI();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <Header {...props} />
            {apiError && (
                <Text style={styles.notificationError} onPress={() => setApiError(null)}>
                    {apiError}
                </Text>
            )}
            {/* {error && <Text style={styles.notificationError}>Error cargando elementos.</Text>} */}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text style={styles.title}>{screenTitle ? screenTitle : "Funciones"}</Text>
                    {standards && !standards.length && <Text>No hay elementos.</Text>}
                    {standards &&
                        standards.map((standard) => (
                            <TouchableOpacity
                                key={standard.id}
                                style={styles.buttom}
                                onPress={() => onClick(standard)}
                            >
                                <Text style={styles.textButton}>{standard.name}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </ScrollView>
            <HelpIcon {...props} />
        </View>
    );
}

Standards.navigationOptions = {
    name: "Standards",
};
