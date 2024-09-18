import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions, ImageBackground} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AICaddieChat from "@/components/ai-caddie-chat";
import WindCompass from "@/components/windCompass";
import { fetchCourses } from "@/services/courseApi";
import { CourseData, HoleData } from "@/constants/interfaces";
import { fetchHole } from "@/services/holeApi";
import GolfHoleMap from "@/components/golf-hole-map";

export type Club = 'Driver' | '3-wood' | '5-wood' | '4-iron' | '5-iron' | '6-iron' | '7-iron' | '8-iron' | '9-iron' | 'PW' | 'SW' | 'Putter';

const { width, height } = Dimensions.get('window');

export default function PlayScreen() {
    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
    const [courseList, setCourseList] = useState<CourseData[]>([]);
    const [currentHoleNumber, setCurrentHoleNumber] = useState(1);
    const [currentHole, setCurrentHole] = useState<HoleData>();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState<Club>('Driver');
    const [recommendedClub, setRecommendedClub] = useState<Club>('Driver');
    const [isClubModalVisible, setIsClubModalVisible] = useState(false);
    const [windSpeed, setWindSpeed] = useState(5);
    const [windDirection, setWindDirection] = useState(0);

    useEffect(() => {
        const fn = async () => {
            let courses = await fetchCourses();
            if (!courses) {
                return;
            }
            setCourseList(courses);
        }
        fn();
    }, [])

    useEffect(() => {
        const fn = async () => {
            if (!selectedCourse || selectedCourse?.holes.length === 0) {
                return;
            }
            const hole = selectedCourse.holes.find(hole => hole.number === currentHoleNumber);
            if (!hole) {
                return;
            }
            let holeData: HoleData = await fetchHole(hole.hole_id);
            if (!holeData) {
                return;
            }
            setCurrentHole(holeData);
        }
        fn();
    }, [selectedCourse, currentHoleNumber])

    const clubs: Club[] = ['Driver', '3-wood', '5-wood', '4-iron', '5-iron', '6-iron', '7-iron', '8-iron', '9-iron', 'PW', 'SW', 'Putter'];

    const toggleClubModal = () => {
        setIsClubModalVisible(!isClubModalVisible);
    };

    const selectCourse = (course: CourseData) => {
        setSelectedCourse(course);
        setCurrentHoleNumber(1);
    };

    const handleNextShot = () => {
        console.log('Next shot button pressed');
    };

    const CourseItem = ({ item }: { item: CourseData }) => (
        <TouchableOpacity style={styles.courseItem} onPress={() => selectCourse(item)}>
            <Text style={styles.courseName}>{item?.course?.course_name}</Text>
        </TouchableOpacity>
    );

    if (!selectedCourse) {
        return (
            <ImageBackground
                source={require('../../assets/images/caddie-app-background.jpg')}
                style={styles.background}
            >
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Select a Course</Text>
                <FlatList
                    data={courseList}
                    renderItem={({ item }) => <CourseItem item={item} />}
                    keyExtractor={(item) => item.course.course_id?.toString()}
                />
            </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/images/course-background.png')}
            style={styles.background}
        >
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                {currentHole && (
                    <View style={styles.mapContainer}>
                        <GolfHoleMap key={currentHoleNumber} holeData={currentHole as HoleData} />
                    </View>
                )}
                <View style={styles.header}>
                    <View style={styles.holeInfo}>
                        <View style={styles.holeAndClubContainer}>
                            <Text style={styles.holeName}>Hole {currentHoleNumber} | </Text>
                            <TouchableOpacity onPress={toggleClubModal} style={styles.clubSelector}>
                                <Text style={styles.selectedClub}>{selectedClub}</Text>
                                <Ionicons name="caret-down" size={16} color="white" style={styles.dropdownCaret} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.selectedCourseName}>{selectedCourse.course.course_name}</Text>
                        {recommendedClub !== selectedClub && <Text style={styles.selectedCourseName}>Recommended Club: {recommendedClub}</Text>}
                    </View>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.chatButton} onPress={() => {}}>
                            <View style={styles.finishIcon}>
                                <Ionicons name="flag" size={24} color="white" />
                                <Ionicons name="checkmark" size={16} color="white" style={styles.checkmark} />
                            </View>
                        </TouchableOpacity>
                        {!isChatOpen && (
                            <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatOpen(!isChatOpen)}>
                                <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {/* Navigation buttons - remove after testing */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => setCurrentHoleNumber(prev => Math.max(1, prev - 1))}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                        <Text style={styles.navButtonText}>Previous Hole</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => setCurrentHoleNumber(prev => Math.min(18, prev + 1))}
                    >
                        <Text style={styles.navButtonText}>Next Hole</Text>
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.windIndicatorContainer}>
                    <WindCompass speed={windSpeed} direction={windDirection} />
                </View>
                <TouchableOpacity style={styles.nextShotButton} onPress={handleNextShot}>
                    <Text style={styles.nextShotButtonText}>Next Shot</Text>
                </TouchableOpacity>
                <AICaddieChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isClubModalVisible}
                    onRequestClose={toggleClubModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Club</Text>
                            {clubs.map((club) => (
                                <TouchableOpacity
                                    key={club}
                                    style={styles.clubItem}
                                    onPress={() => {
                                        setSelectedClub(club);
                                        toggleClubModal();
                                    }}
                                >
                                    <Text style={styles.clubItemText}>{club}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity style={styles.closeButton} onPress={toggleClubModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    chatButton: {
        backgroundColor: '#2E7D32',
        padding: 10,
        borderRadius: 25,
        marginRight: 20,
    },
    clubSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownCaret: {
        marginTop: 2,
    },
    courseItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    windIndicatorContainer: {
        position: 'absolute',
        left: 20,
        bottom: 150,
        zIndex: 1,
    },
    courseName: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    selectedCourseName: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    finishIcon: {
        position: 'relative',
    },
    checkmark: {
        position: 'absolute',
        right: -5,
        bottom: -5,
    },
    holeInfo: {
        marginBottom: 20,
    },
    holeName: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    nextShotButton: {
        position: 'absolute',
        right: 20,
        bottom: 150,
        backgroundColor: '#2E7D32',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        zIndex: 1,
    },
    nextShotButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E7D32',
        padding: 10,
        borderRadius: 5,
    },
    navButtonText: {
        color: 'white',
        marginHorizontal: 5,
    },
    selectedClub: {
        fontSize: 24,
        color: 'white',
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    clubItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    clubItemText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2E7D32',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    holeAndClubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});
