import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';

interface WindIndicatorProps {
  speed: number;
  direction: number;
}

const WindIndicator: React.FC<WindIndicatorProps> = ({ speed, direction }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { transform: [{ rotate: `${direction}deg` }] }]}>
        <Svg height="40" width="40" viewBox="0 0 100 100">
          {/* Wavy lines */}
          <Path
            d="M10 35 Q25 20 40 35 T70 35"
            fill="none"
            stroke="white"
            strokeWidth="6"
          />
          <Path
            d="M10 65 Q25 50 40 65 T70 65"
            fill="none"
            stroke="white"
            strokeWidth="6"
          />
          {/* Arrows */}
          <Polygon
            points="75,20 90,35 75,50"
            fill="white"
          />
          <Polygon
            points="75,50 90,65 75,80"
            fill="white"
          />
        </Svg>
      </View>
      <Text style={styles.speedText}>{speed} mph</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 40,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});

export default WindIndicator;
