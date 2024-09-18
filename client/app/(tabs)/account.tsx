import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import Profile from "@/app/screens/profile";
import GolfBag from "@/app/screens/golf-bag";
import Notifications from "@/app/screens/notifications";
import Settings from "@/app/screens/settings";

type AccountStackParamList = {
    AccountHome: undefined;
    Profile: undefined;
    GolfBag: undefined;
    Notifications: undefined;
    Settings: undefined;
};
const { height } = Dimensions.get('window');
const Stack = createStackNavigator();

type AccountScreenNavigationProp = StackNavigationProp<AccountStackParamList, 'AccountHome'>;
interface AccountHomeScreenProps {
    navigation: AccountScreenNavigationProp;
}

function AccountHomeScreen({ navigation }: AccountHomeScreenProps) {
    return (
        <ImageBackground
            source={require('../../assets/images/caddie-app-background.jpg')}
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Account</Text>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name="person-outline" size={24} color="#2E7D32" />
                    <Text style={styles.optionText}>Profile Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('GolfBag')}>
                    <Ionicons name="golf-outline" size={24} color="#2E7D32" />
                    <Text style={styles.optionText}>My Golf Bag</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Notifications')}>
                    <Ionicons name="notifications-outline" size={24} color="#2E7D32" />
                    <Text style={styles.optionText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={24} color="#2E7D32" />
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

export default function AccountScreen() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Stack.Screen name="AccountHome" component={AccountHomeScreen} />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Profile',
                    headerTintColor: '#FFFFFF',
                    headerLeft: (props) => (
                        <TouchableOpacity {...props}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="GolfBag"
                component={GolfBag}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'My Golf Bag',
                    headerTintColor: '#FFFFFF',
                    headerLeft: (props) => (
                        <TouchableOpacity {...props}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Notifications',
                    headerTintColor: '#FFFFFF',
                    headerLeft: (props) => (
                        <TouchableOpacity {...props}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'Settings',
                    headerTintColor: '#FFFFFF',
                    headerLeft: (props) => (
                        <TouchableOpacity {...props}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        marginTop: height * .05,
        paddingBottom: 100, // To account for the tab bar
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#2E7D32',
        marginLeft: 10,
    },
});
