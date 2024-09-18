import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function PreviousRoundsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Previous Rounds</Text>
            {/* Add a list or grid of previous rounds here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
