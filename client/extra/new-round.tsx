import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// Mock data for a golf course
const mockCourse = {
    name: "Sample Golf Course",
    holes: [
        { number: 1, par: 4, distance: 400 },
        { number: 2, par: 3, distance: 180 },
        { number: 3, par: 5, distance: 520 },
        // ... add more holes as needed
    ]
};

export default function NewRoundScreen() {
    const [currentHole, setCurrentHole] = useState(0);

    const nextHole = () => {
        if (currentHole < mockCourse.holes.length - 1) {
            setCurrentHole(currentHole + 1);
        }
    };

    const prevHole = () => {
        if (currentHole > 0) {
            setCurrentHole(currentHole - 1);
        }
    };

    const hole = mockCourse.holes[currentHole];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.courseName}>{mockCourse.name}</Text>
            <View style={styles.holeInfo}>
                <Text style={styles.holeNumber}>Hole {hole.number}</Text>
                <Text style={styles.holePar}>Par {hole.par}</Text>
                <Text style={styles.holeDistance}>{hole.distance} yards</Text>
            </View>
            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navButton} onPress={prevHole}>
                    <Text style={styles.navButtonText}>Previous Hole</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={nextHole}>
                    <Text style={styles.navButtonText}>Next Hole</Text>
                </TouchableOpacity>
            </View>
            {/* Add more UI elements for shot tracking, recommendations, etc. */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    courseName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    holeInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    holeNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    holePar: {
        fontSize: 18,
        marginBottom: 5,
    },
    holeDistance: {
        fontSize: 18,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    navButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
