import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';

export type Club = 'Driver' | '3-wood' | '5-wood' | '4-iron' | '5-iron' | '6-iron' | '7-iron' | '8-iron' | '9-iron' | 'PW' | 'SW' | 'Putter';

interface ClubImage {
  [key: string]: any;
}

interface ClubSelectorProps {
  selectedClub: Club;
  onSelectClub: (club: Club) => void;
}

const clubImages: ClubImage = {
  Driver: require('../assets/images/clubs/driver.png'),
  '3-wood': require('../assets/images/clubs/3-wood.png'),
  // Add images for other clubs...
};

const ClubSelector: React.FC<ClubSelectorProps> = ({ selectedClub, onSelectClub }) => {
  const [isOpen, setIsOpen] = useState(false);
  const clubs: Club[] = ['Driver', '3-wood', '5-wood', '4-iron', '5-iron', '6-iron', '7-iron', '8-iron', '9-iron', 'PW', 'SW', 'Putter'];

  return (
    <View style={styles.clubSelectorContainer}>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Image source={clubImages[selectedClub]} style={styles.clubImage} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.clubList}>
            {clubs.map((club) => (
              <TouchableOpacity
                key={club}
                style={styles.clubItem}
                onPress={() => {
                  onSelectClub(club);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.clubItemText}>{club}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};




export default ClubSelector;

const windowWidth = Dimensions.get('window').width;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // ... your existing styles

  clubSelectorContainer: {
    position: 'absolute',
    left: -25,
    top: windowHeight / 2 - (windowHeight * 0.25), // Adjust this to center vertically
    alignItems: 'center', // Center horizontally
    zIndex: 1,
  },
  clubImage: {
    width: windowWidth * 0.50,
    height: windowHeight * 0.50,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubList: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxHeight: '80%',
  },
  clubItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clubItemText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});



