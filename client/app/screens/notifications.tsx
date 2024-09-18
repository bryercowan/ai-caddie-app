import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Notifications() {
    return (
        <ImageBackground
            source={require('../../assets/images/caddie-app-background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.text}>Notifications Screen</Text>
            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#FFFFFF',
    },
});
