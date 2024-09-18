import React from 'react';
import {View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions} from 'react-native';

const { height } = Dimensions.get('window');

export default function PlaystyleScreen() {
    return (
        <ImageBackground
            source={require('../../assets/images/caddie-app-background.jpg')}
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Playstyle</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Club Statistics</Text>
                    {/* Add club statistics here */}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Previous Rounds</Text>
                    {/* Add list of previous rounds here */}
                </View>
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
        flexGrow: 1,
        marginTop: height * .05,
        padding: 20,
        paddingBottom: 100, // To account for the tab bar
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    section: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
    },
});
