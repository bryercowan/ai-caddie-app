import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: '#AAAAAA',
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="playstyle"
                options={{
                    title: 'Playstyle',
                    tabBarIcon: ({ color }) => <Ionicons name="golf" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="play"
                options={{
                    title: 'Play',
                    tabBarIcon: ({ color }) => (
                        <View style={styles.playButtonContainer}>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={32} color={color} />
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: '#FFFFFF',
        height: 80,
        paddingBottom: 20,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    playButtonContainer: {
        position: 'absolute',
        top: -40,
        alignSelf: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: '#20382b',
        borderWidth: 2,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
