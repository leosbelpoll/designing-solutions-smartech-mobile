import { StyleSheet } from "react-native";

export const COLOR_PRIMARY = "#b7c62f";
export const COLOR_ERROR = "rgb(238,87,55)";
export const COLOR_SUCCESS = "rgb(110,175,55)";
export const COLOR_LIGHT = "white";
export const COLOR_DARK = "rgb(49,47,45)";
export const COLOR_LIGHT_GREY = "rgb(211,211,210)";
export const COLOR_DARK_GREY = "rgb(163,162,161)";
export const COLOR_BACKGROUND = "#FFFAFA";

const BORDER_RADIUS = 15;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_BACKGROUND,
    },
    contentContainer: {
        paddingHorizontal: 35,
        paddingTop: 150,
        paddingBottom: 100,
    },
    contentContainerForm: {
        paddingHorizontal: 35,
        paddingTop: 30,
        paddingBottom: 100,
    },
    containerHeader: {
        marginTop: 30,
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: COLOR_BACKGROUND,
    },
    imagenHeader: {
        width: 150,
        height: 50,
        resizeMode: "contain",
    },
    title: {
        fontSize: 25,
        textAlign: "center",
        marginBottom: 25,
    },
    label: {
        color: COLOR_DARK,
        paddingLeft: 10,
        marginTop: 15,
        marginBottom: 5,
    },
    inputs: {
        borderRadius: BORDER_RADIUS,
        borderColor: COLOR_LIGHT_GREY,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    inputError: {
        borderRadius: BORDER_RADIUS,
        borderColor: COLOR_ERROR,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    select: {
        borderRadius: BORDER_RADIUS,
        borderColor: COLOR_LIGHT_GREY,
        borderWidth: 1,
        paddingHorizontal: 20,
    },
    selectError: {
        borderColor: COLOR_ERROR,
    },
    inputArea: {
        minHeight: 140,
    },
    inputAreaError: {
        minHeight: 140,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        borderColor: COLOR_ERROR,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttom: {
        backgroundColor: COLOR_PRIMARY,
        padding: 20,
        borderRadius: BORDER_RADIUS,
        marginTop: 15,
    },
    textButton: {
        color: COLOR_LIGHT,
        textAlign: "center",
    },
    textError: {
        color: COLOR_ERROR,
    },
    textLight: {
        color: COLOR_LIGHT,
        textAlign: "center",
    },
    textRight: {
        textAlign: "right",
    },
    floatRight: {
        alignItems: "flex-end",
    },
    modal: {
        marginTop: 22,
        marginHorizontal: 20,
        backgroundColor: COLOR_LIGHT_GREY,
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    floatLeft: {
        alignItems: "flex-start",
    },
    guideImage: {
        alignItems: "flex-start",
        marginTop: 300,
    },
    buttonEmptyFile: {
        backgroundColor: COLOR_LIGHT_GREY,
        marginVertical: 10,
        borderRadius: BORDER_RADIUS,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttonFile: {
        backgroundColor: COLOR_PRIMARY,
        marginVertical: 10,
        borderRadius: BORDER_RADIUS,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttomAction: {
        backgroundColor: COLOR_PRIMARY,
        borderRadius: BORDER_RADIUS,
        padding: 10,
        paddingHorizontal: 30,
        marginVertical: 25,
    },
    containerFooter: {
        position: "absolute",
        bottom: 20,
        left: 20,
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR_LIGHT_GREY,
        padding: 10,
        paddingTop: 20,
        borderRadius: 30,
    },
    iconFooter: {
        paddingBottom: 8,
    },

    // NOTIFICATIONS

    notificationSuccess: {
        backgroundColor: COLOR_SUCCESS,
        color: COLOR_LIGHT,
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: "center",
    },
    notificationError: {
        backgroundColor: COLOR_ERROR,
        color: COLOR_LIGHT,
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: "center",
    },
});
