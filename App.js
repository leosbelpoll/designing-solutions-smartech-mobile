import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import * as React from "react";
import { StyleSheet, View, AsyncStorage, Vibration, Alert } from "react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import Login from "./screens/Login";
import Projects from "./screens/Projects";
import Standards from "./screens/Standards";
import Form from "./screens/Form";
import Footer from "./components/Footer";
import Vehicle from "./screens/Vehicle";
import Camera from "./screens/Camera";
import { PUSH_NOTIFICATION_TOKEN } from "./configs";

const Stack = createStackNavigator();

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);

	const registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
			  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			  finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				Alert.alert('Error configurando las notificaciones!');
			  return;
			}
			token = await Notifications.getExpoPushTokenAsync();
			AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token);
		  } else {
			Alert.alert('Debe usar un dispositivo fisico');
		  }
	  
		  if (Platform.OS === 'android') {
			Notifications.createChannelAndroidAsync('default', {
			  name: 'default',
			  sound: true,
			  priority: 'max',
			  vibrate: [0, 250, 250, 250],
			});
		  }
	};

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHide();

				// Load fonts
				await Font.loadAsync({
					...Ionicons.font,
					"space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
				});
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hide();
			}
		}

		loadResourcesAndDataAsync();

		registerForPushNotificationsAsync();

		// Handle notifications that are received or selected while the app
		// is open. If the app was closed and then opened by tapping the
		// notification (rather than just tapping the app icon to open it),
		// this function will fire on the next tick after the app starts
		// with the notification data.
		Notifications.addListener(_handleNotification);
	}, []);

	const _handleNotification = notification => {
		Vibration.vibrate();
		// Do something with the notification.data
	};

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return null;
	} else {
		return (
			<View style={styles.container}>
				{/* {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />} */}
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false
						}}
						initialRouteName='Login'
					>
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Projects" component={Projects} />
						<Stack.Screen name="Standards" component={Standards} />
						<Stack.Screen name="Camera" component={Camera} />
						<Stack.Screen name="Vehicle" component={Vehicle} />
						<Stack.Screen name="Form" component={Form} />
					</Stack.Navigator>
				</NavigationContainer>
				<Footer />
			</View>
		);
	}
	p;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
