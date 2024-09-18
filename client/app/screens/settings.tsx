import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <ImageBackground
            source={require('../../assets/images/caddie-app-background.jpg')}
            style={styles.background}
        >
            <ScrollView style={styles.container}>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={notifications ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Account</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Privacy</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>About</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
                    <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    },
    settingText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        borderRadius: 5,
        justifyContent: 'center',
    },
    logoutText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
