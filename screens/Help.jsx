import React, { useState } from "react";
import { Text, TouchableOpacity, View, TextInput, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../styles";

import Loading from "./Loading";
import Header from "../components/Header";

export default function Help(props) {
    const [error, setError] = useState();
    const [connectionError] = useState();
    const [validating, isValidating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [position, setPosition] = useState();
    const [problem, setProblem] = useState();

    const onRequestHelp = async () => {
        if (!name || !position || !problem) {
            isValidating(true);
            return;
        }
        isValidating(false);
        setLoading(true);
        setError(null);

        // TODO: implement send mail

        setLoading(false);
        Alert.alert("Es necesario configurar un servidor de correos");
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingTop: 0,
            }}
        >
            <Header {...props} />
            {error && (
                <Text style={styles.notificationError} onPress={() => setError(null)}>
                    Ha ocurrido un error.
                </Text>
            )}
            {connectionError && (
                <Text style={styles.notificationError} onPress={() => setError(null)}>
                    Ha ocurrido un error de red.
                </Text>
            )}
            {validating && (!name || !position) && (
                <Text style={styles.notificationError} onPress={() => isValidating(false)}>
                    Valide los campos del formulario.
                </Text>
            )}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text style={styles.title}> Cuéntenos </Text>
                    <TextInput
                        style={validating && !name ? styles.inputError : styles.inputs}
                        placeholder="Nombre"
                        onChangeText={(text) => {
                            setName(text);
                            setError(null);
                        }}
                        value={name}
                    />
                    {validating && !name && <Text style={styles.textError}>Campo requerido</Text>}
                    <TextInput
                        style={[
                            validating && !position ? styles.inputError : styles.inputs,
                            { marginTop: 20 },
                        ]}
                        placeholder="Cargo"
                        onChangeText={(text) => {
                            setPosition(text);
                            setError(null);
                        }}
                        value={position}
                    />
                    {validating && !position && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    <TextInput
                        style={[
                            styles.inputArea,
                            validating && !problem ? styles.inputError : styles.inputs,
                        ]}
                        placeholder="Problema evidenciado"
                        onChangeText={(text) => {
                            setProblem(text);
                            setError(null);
                        }}
                        value={problem}
                    />
                    {validating && !problem && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    <TouchableOpacity style={styles.buttom} onPress={() => onRequestHelp()}>
                        <Text style={styles.textButton}>{loading ? "Loading ..." : "Enviar"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

Help.navigationOptions = {
    name: "Help",
};
