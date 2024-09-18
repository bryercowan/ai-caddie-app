import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default function AuthScreen() {
    const router = useRouter();

    const handleAuth = () => {
        router.replace('/(tabs)/play');
    };

    return (
        <ImageBackground
            source={require('../assets/images/caddie-app-logo-full-v2.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleAuth}>
                        <Text style={styles.buttonText}>{'Log In'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.switchButton} onPress={() => {}}>
                        <Text style={styles.switchText}>
                            {"Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
    },
    contentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: height * 0.275,
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
        width: width * 0.8, // Make the button 80% of the screen width
        alignItems: 'center',
    },
    buttonText: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        width: width * 0.8, // Make the switch button the same width as the main button
        alignItems: 'center',
    },
    switchText: {
        color: 'white',
        fontSize: 16,
    },
});
