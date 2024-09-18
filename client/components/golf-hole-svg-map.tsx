import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import proj4 from 'proj4';
import { HoleData } from "@/constants/interfaces";

const { width, height } = Dimensions.get('window');

type Props = {
    holeData: HoleData;
};

// Define the WGS84 to Web Mercator projection
const fromProjection = 'EPSG:4326'; // WGS 84 (lat/lon)
const toProjection = 'EPSG:3857'; // Web Mercator

const GolfHoleSvgMap: React.FC<Props> = ({ holeData }) => {
    // Function to convert lat/lon to x, y
    const projectCoordinates = (latitude: number, longitude: number) => {
        const [x, y] = proj4(fromProjection, toProjection, [longitude, latitude]);
        return { x, y };
    };

    // Projected polygons
    const projectedPolygons = holeData.polygons.map(polygon => ({
        surfaceType: polygon.surface_type,
        points: projectCoordinates(polygon.lat!, polygon.long!)
    }));

    // Projected vectors for markers
    const projectedVectors = holeData.vectors.map(vector => ({
        vectorType: vector.vector_type,
        point: projectCoordinates(vector.lat!, vector.long!)
    }));

    return (
        <View style={styles.container}>
            <Svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={styles.svgMap}
            >
                {/* Render polygons */}
                {projectedPolygons.map((polygon, index) => (
                    <Polygon
                        key={index}
                        points={`${polygon.points.x},${polygon.points.y}`} // Format for SVG
                        fill={getSurfaceColor(polygon.surfaceType ?? null)}
                        stroke="black"
                        strokeWidth="1"
                    />
                ))}
                {/* Render markers */}
                {projectedVectors.map((vector, index) => (
                    <Circle
                        key={index}
                        cx={vector.point.x}
                        cy={vector.point.y}
                        r="5"
                        fill={getMarkerColor(vector.vectorType ?? null)}
                    />
                ))}
            </Svg>
        </View>
    );
};

const getSurfaceColor = (surfaceType: string | null): string => {
    switch (surfaceType) {
        case 'Green': return '#228B22';
        case 'Fairway': return '#32CD32';
        case 'Rough': return '#006400';
        case 'Bunker': return '#F4A460';
        case 'Water': return '#4169E1';
        case 'Woods': return '#006400';
        case 'Sand': return '#C2B280';
        default: return '#808080';
    }
};

const getMarkerColor = (vectorType: string | null): string => {
    switch (vectorType) {
        case 'Flag': return 'gold';
        case 'White': return 'white';
        case 'Red': return 'red';
        default: return 'black';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    svgMap: {
        backgroundColor: 'lightgrey',
    },
});

export default GolfHoleSvgMap;
