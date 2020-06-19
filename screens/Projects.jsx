import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, AsyncStorage } from "react-native";
import styles from "../styles";
import { ScrollView } from "react-native-gesture-handler";
import { API_URL, ACCESS_TOKEN_IDENTIFIER, USER_NAME } from "../configs";
import Header from "../components/Header";
import HelpIcon from "../components/HelpIcon";
import Loading from "./Loading";

export default function Projects(props) {
    const { route } = props;
    const [projects, setProjects] = useState();
    const [notification, setNotification] = useState();
    const [loading, setLoading] = useState(false);

    const fetchMyAPI = async () => {
        setLoading(true);
        AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
            .then((token) => {
                fetch(`${API_URL}/projects`, {
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
                            setProjects(res);
                            setLoading(false);
                        }
                    });
            })
            .done();
    };

    useEffect(() => {
        if (route.params && route.params.notification) {
            setNotification(route.params.notification);
        }
        fetchMyAPI();
    }, [route]);

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <Header {...props} />
            {/* {error && <Text style={styles.notificationError}>Error cargando elementos.</Text>} */}
            {notification && (
                <Text
                    style={
                        notification.type === "success"
                            ? styles.notificationSuccess
                            : styles.notificationError
                    }
                    onPress={() => setNotification(null)}
                >
                    {notification.message}
                </Text>
            )}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text style={styles.title}>
                        Elija el proyecto para el cual va a diligenciar la información
                    </Text>
                    {projects && !projects.length && <Text>No hay elementos.</Text>}
                    {projects &&
                        projects.map((project) => (
                            <TouchableOpacity
                                key={project.id}
                                style={styles.buttom}
                                onPress={() => {
                                    props.navigation.navigate("Standards", {
                                        project,
                                    });
                                    setNotification(null);
                                }}
                            >
                                <Text style={styles.textButton}>{project.name}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </ScrollView>
            <HelpIcon {...props} />
        </View>
    );
}

Projects.navigationOptions = {
    name: "Projects",
};
