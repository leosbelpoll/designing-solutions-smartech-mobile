import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, AsyncStorage, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { API_URL, ACCESS_TOKEN_IDENTIFIER, USER_NAME } from "../configs";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-community/picker";
import Header from "../components/Header";
import Loading from "./Loading";
import styles from "../styles";

export default function Vehicle(props) {
    const { standard, project } = props.route.params;
    const [automoviles, setAutomoviles] = useState([]);
    const [bombasAbastecimiento, setBombasAbastecimiento] = useState([]);
    const [sistemasAmortiguacion, setSistemasAmortiguacion] = useState([]);
    const [estadosMedicion, setEstadosMedicion] = useState([]);
    const [error, setError] = useState();
    const [automovil, setAutomovil] = useState();
    const [recorridoInicial, setRecorridoInicial] = useState("");
    const [recorridoFinal, setRecorridoFinal] = useState("");
    const [galonesComprados, setGalonesComprados] = useState("");
    const [bombaAbastecimiento, setBombaAbastecimiento] = useState();
    const [sistemaAmortiguacion, setSistemaAmortiguacion] = useState();
    const [explicacionCapacitacion, setExplicacionCapacitacion] = useState("");
    const [estadoMedicion, setEstadoMedicion] = useState();
    const [presionNeumaticos, setPresionNeumaticos] = useState("");
    const [recorridoInicialImagen, setRecorridoInicialImagen] = useState("");
    const [recorridoFinalImagen, setRecorridoFinalImagen] = useState("");
    const [galonesCompradosImagen, setGalonesCompradosImagen] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isInvalidForm, setIsInvalidForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState(false);

    const openGallery = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (resultPermission) {
            const resultImagePiker = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
            });
            return resultImagePiker;
        }
    };

    const openGalleryRecorridoInicial = async () => {
        const value = await openCamera(setRecorridoInicialImagen);
    };

    const openGalleryRecorridoFinal = async () => {
        const value = await openCamera(setRecorridoFinalImagen);
    };

    const openGalleryGalonesComprados = async () => {
        const value = await openCamera(setGalonesCompradosImagen);
    };

    const openCamera = async (operation) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        if (status === "granted") {
            props.navigation.navigate("Camera", {
                operation,
            });
        } else {
            Alert.alert("La app no tiene permisos para usar la camara");
        }
    };

    const getFile = (uri) => {
        let localUri = uri;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        return { uri: localUri, name: filename, type };
    };

    const throwAccountError = () => {
        AsyncStorage.removeItem(ACCESS_TOKEN_IDENTIFIER);
        AsyncStorage.removeItem(USER_NAME);
        props.navigation.navigate("Login", {
            notification: {
                type: "error",
                message: "Ingrese nuevamente por favor",
            },
        });
    };

    const saveData = async () => {
        if (
            !recorridoInicial ||
            !recorridoFinal ||
            !galonesComprados ||
            !explicacionCapacitacion ||
            !presionNeumaticos ||
            !recorridoInicialImagen ||
            !recorridoFinalImagen ||
            !galonesCompradosImagen
        ) {
            setIsValidating(true);
            setIsInvalidForm(true);
        } else {
            setIsInvalidForm(false);
            setLoading(true);
            AsyncStorage.getItem(USER_NAME)
                .then((username) => {
                    AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
                        .then((token) => {
                            let formData = new FormData();
                            formData.append("username", username);
                            formData.append("project_id", project.id);
                            formData.append("standard_id", standard.id);
                            formData.append("automovil_id", automovil || automoviles[0].value);
                            formData.append("recorrido_inicial", recorridoInicial);
                            formData.append("recorrido_final", recorridoFinal);
                            formData.append("galones_comprados", galonesComprados);
                            formData.append(
                                "bomba_abastecimiento_id",
                                bombaAbastecimiento || bombasAbastecimiento[0].value,
                            );
                            formData.append(
                                "sistema_amortiguacion_id",
                                sistemaAmortiguacion || sistemasAmortiguacion[0].value,
                            );
                            formData.append("explicacion_capacitacion", explicacionCapacitacion);
                            formData.append(
                                "estado_medicion_id",
                                estadoMedicion || estadosMedicion[0].value,
                            );
                            formData.append("presion_neumaticos", presionNeumaticos);
                            formData.append(
                                "recorrido_inicial_image",
                                getFile(recorridoInicialImagen),
                            );
                            formData.append("recorrido_final_image", getFile(recorridoFinalImagen));
                            formData.append(
                                "galones_comprados_image",
                                getFile(galonesCompradosImagen),
                            );
                            fetch(`${API_URL}/vehicles`, {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (
                                        ["Unauthorized.", "Unauthenticated."].includes(res.message)
                                    ) {
                                        throwAccountError();
                                    } else if (res.errors) {
                                        setLoading(false);
                                        setApiErrors(res.errors);
                                    } else {
                                        setError(null);
                                        setApiErrors(null);
                                        props.navigation.navigate("Projects", {
                                            project,
                                            standard,
                                            username,
                                            notification: {
                                                type: "success",
                                                message: `Vehículo creado correctamente`,
                                            },
                                        });
                                    }
                                });
                        })
                        .done();
                })
                .done();
        }
    };

    const fetchMyAPI = async () => {
        setLoading(true);
        AsyncStorage.getItem(ACCESS_TOKEN_IDENTIFIER)
            .then((token) => {
                fetch(`${API_URL}/automoviles`, {
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
                            throwAccountError();
                        } else {
                            setError(null);
                            setAutomoviles(res.map((obj) => ({ value: obj.id, label: obj.name })));
                            if (automoviles.length) {
                                setAutomovil(automoviles[0].value);
                            }

                            fetch(`${API_URL}/bombas-abastecimiento`, {
                                method: "GET",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (
                                        ["Unauthorized.", "Unauthenticated."].includes(res.message)
                                    ) {
                                        throwAccountError();
                                    } else {
                                        setError(null);
                                        setBombasAbastecimiento(
                                            res.map((obj) => ({ value: obj.id, label: obj.name })),
                                        );
                                        if (bombasAbastecimiento.length) {
                                            setBombaAbastecimiento(bombasAbastecimiento[0].value);
                                        }

                                        fetch(`${API_URL}/sistemas-amortiguacion`, {
                                            method: "GET",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${token}`,
                                            },
                                        })
                                            .then((res) => res.json())
                                            .then((res) => {
                                                if (
                                                    ["Unauthorized.", "Unauthenticated."].includes(
                                                        res.message,
                                                    )
                                                ) {
                                                    throwAccountError();
                                                } else {
                                                    setError(null);
                                                    setSistemasAmortiguacion(
                                                        res.map((obj) => ({
                                                            value: obj.id,
                                                            label: obj.name,
                                                        })),
                                                    );
                                                    if (sistemasAmortiguacion.length) {
                                                        setSistemaAmortiguacion(
                                                            sistemasAmortiguacion[0].value,
                                                        );
                                                    }

                                                    fetch(`${API_URL}/estados-medicion`, {
                                                        method: "GET",
                                                        headers: {
                                                            Accept: "application/json",
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    })
                                                        .then((res) => res.json())
                                                        .then((res) => {
                                                            if (
                                                                [
                                                                    "Unauthorized.",
                                                                    "Unauthenticated.",
                                                                ].includes(res.message)
                                                            ) {
                                                                throwAccountError();
                                                            } else {
                                                                setError(null);
                                                                setEstadosMedicion(
                                                                    res.map((obj) => ({
                                                                        value: obj.id,
                                                                        label: obj.name,
                                                                    })),
                                                                );
                                                                if (estadosMedicion.length) {
                                                                    setEstadoMedicion(
                                                                        estadosMedicion[0].value,
                                                                    );
                                                                }
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
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
            {isInvalidForm && (
                <Text style={styles.notificationError}>Verifique los campos del formulario.</Text>
            )}
            {apiErrors &&
                Object.keys(apiErrors).map((key) => (
                    <Text
                        key={key}
                        style={styles.notificationError}
                        onPress={() => setApiErrors(null)}
                    >
                        {apiErrors[key][0]}
                    </Text>
                ))}
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainerForm}
            >
                <View>
                    <Text style={styles.title}>{standard.name}</Text>

                    <Text style={styles.label}>No Placa</Text>
                    <View style={styles.select}>
                        <Picker
                            onValueChange={(itemValue) => setAutomovil(itemValue)}
                            selectedValue={automovil}
                        >
                            {automoviles.map((item) => (
                                <Picker.Item
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Recorrido Inicial</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={
                            (!recorridoInicial || isNaN(recorridoInicial)) && isValidating
                                ? styles.inputError
                                : styles.inputs
                        }
                        placeholder="Km/h"
                        onChangeText={(text) => setRecorridoInicial(text)}
                        value={recorridoInicial}
                    />
                    {!recorridoInicial && isValidating && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    {isValidating && isNaN(recorridoInicial) && (
                        <Text style={styles.textError}>Campo numérico</Text>
                    )}
                    <View style={styles.floatRight}>
                        <TouchableOpacity
                            style={
                                recorridoInicialImagen ? styles.buttonFile : styles.buttonEmptyFile
                            }
                            onPress={() => openGalleryRecorridoInicial()}
                        >
                            <Text style={styles.textLight}>Seleccionar archivo</Text>
                        </TouchableOpacity>
                    </View>
                    {!recorridoInicialImagen && isValidating && (
                        <Text style={[styles.textRight, styles.textError]}>Imágen requerida</Text>
                    )}

                    <Text style={styles.label}>Recorrido Final</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={
                            (!recorridoFinal || isNaN(recorridoFinal)) && isValidating
                                ? styles.inputError
                                : styles.inputs
                        }
                        placeholder="Km/h"
                        onChangeText={(text) => setRecorridoFinal(text)}
                        value={recorridoFinal}
                    />
                    {!recorridoFinal && isValidating && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    {isValidating && isNaN(recorridoFinal) && (
                        <Text style={styles.textError}>Campo numérico</Text>
                    )}
                    <View style={styles.floatRight}>
                        <TouchableOpacity
                            style={
                                recorridoFinalImagen ? styles.buttonFile : styles.buttonEmptyFile
                            }
                            onPress={() => openGalleryRecorridoFinal()}
                        >
                            <Text style={styles.textLight}>Seleccionar archivo</Text>
                        </TouchableOpacity>
                    </View>
                    {!recorridoFinalImagen && isValidating && (
                        <Text style={[styles.textRight, styles.textError]}>Imágen requerida</Text>
                    )}

                    <Text style={styles.label}>Galones Comprados</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={
                            (!galonesComprados || isNaN(galonesComprados)) && isValidating
                                ? styles.inputError
                                : styles.inputs
                        }
                        placeholder="Cant"
                        onChangeText={(text) => setGalonesComprados(text)}
                        value={galonesComprados}
                    />
                    {!galonesComprados && isValidating && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    {isValidating && isNaN(galonesComprados) && (
                        <Text style={styles.textError}>Campo numérico</Text>
                    )}
                    <View style={styles.floatRight}>
                        <TouchableOpacity
                            style={
                                galonesCompradosImagen ? styles.buttonFile : styles.buttonEmptyFile
                            }
                            onPress={() => openGalleryGalonesComprados()}
                        >
                            <Text style={styles.textLight}>Seleccionar archivo</Text>
                        </TouchableOpacity>
                    </View>
                    {!galonesCompradosImagen && isValidating && (
                        <Text style={[styles.textRight, styles.textError]}>Imágen requerida</Text>
                    )}

                    <Text style={styles.label}>Bomba de Abastecimiento</Text>
                    <View style={styles.select}>
                        <Picker
                            onValueChange={(itemValue) => setBombaAbastecimiento(itemValue)}
                            selectedValue={bombaAbastecimiento}
                        >
                            {bombasAbastecimiento.map((item) => (
                                <Picker.Item
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Sistema de amortiguación del vehículo</Text>
                    <View style={styles.select}>
                        <Picker
                            onValueChange={(itemValue) => setSistemaAmortiguacion(itemValue)}
                            selectedValue={sistemaAmortiguacion}
                        >
                            {sistemasAmortiguacion.map((item) => (
                                <Picker.Item
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>
                        Breve explicación capacitación de buenas práctica de hoy.
                    </Text>
                    <TextInput
                        style={
                            !explicacionCapacitacion && isValidating
                                ? styles.inputAreaError
                                : [styles.inputs, styles.inputArea]
                        }
                        multiline={true}
                        placeholder="Escriba"
                        onChangeText={(text) => setExplicacionCapacitacion(text)}
                        value={explicacionCapacitacion}
                    />
                    {!explicacionCapacitacion && isValidating && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}

                    <Text style={styles.label}>Estado de Medición vehículo</Text>
                    <View style={styles.select}>
                        <Picker
                            onValueChange={(itemValue) => setEstadoMedicion(itemValue)}
                            selectedValue={estadoMedicion}
                        >
                            {estadosMedicion.map((item) => (
                                <Picker.Item
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.label}>Presión de los neumático</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={
                            (!presionNeumaticos || isNaN(presionNeumaticos)) && isValidating
                                ? styles.inputError
                                : styles.inputs
                        }
                        placeholder="Psi"
                        onChangeText={(text) => setPresionNeumaticos(text)}
                        value={presionNeumaticos}
                    />
                    {!presionNeumaticos && isValidating && (
                        <Text style={styles.textError}>Campo requerido</Text>
                    )}
                    {isValidating && isNaN(presionNeumaticos) && (
                        <Text style={styles.textError}>Campo numérico</Text>
                    )}

                    <View style={styles.floatRight}>
                        <TouchableOpacity style={styles.buttomAction} onPress={() => saveData()}>
                            <Text style={styles.textLight}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

Vehicle.navigationOptions = {
    name: "Vehicle",
};
