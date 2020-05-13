import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, AsyncStorage } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../styles";
import { ACCESS_TOKEN_IDENTIFIER, API_URL } from "../configs";

export default function Standards(props) {
    const [standards, setStandards] = useState();
	const { project } = props.route.params;
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const fetchMyAPI = async () => {
        setLoading(true);
        AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
            .then(token => {
                fetch(`${API_URL}/standards`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => res.json())
                    .then(res => {
                        if (["Unauthorized.", "Unauthenticated."].includes(res.message)) {
                            setError("Unauthorized");
                            setStandards(null);
                        } else {
                            setError(null);
                            setStandards(res);
                        }
                    });
                setLoading(false);
            })
            .done();
    };

    useEffect(() => {
        fetchMyAPI();
	}, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text style={styles.title}>Elige la Norma ISO</Text>
					{loading && <Text>Loading ...</Text>}
                    {error && <Text style={styles.textError}>Error cargando elementos.</Text>}
                    {(!standards || !standards.length) && !error && <Text>No hay elementos.</Text>}
                    {standards && standards.map(standard => (
                        <TouchableOpacity
                            key={standard.id}
                            style={styles.buttom}
                            onPress={() =>
                                props.navigation.navigate("SubStandards", {
                                    project,
                                    standard,
                                })
                            }
                        >
                            <Text style={styles.textButton}>{standard.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

Standards.navigationOptions = {
    name: "Standards",
};
