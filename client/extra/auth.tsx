import React, { useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Dimensions} from 'react-native';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const handleAuth = () => {
        // TODO: Implement actual authentication logic
        router.replace('/(tabs)');
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
                        <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
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
        bottom: height * 0.5, // Adjust this value to raise the logo closer to the main logo
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
        width: width * 0.8, // Maintain the same width as the switch button
        alignItems: 'center',
    },
    buttonText: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        width: 'auto', // Automatically adjust the width based on content
        alignItems: 'center',
    },
    switchText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
