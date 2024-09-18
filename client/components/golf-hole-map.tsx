import React, {forwardRef, useEffect, useRef, useState} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, {Marker, Polygon, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {HoleData} from "@/constants/interfaces";

type Coordinate = {
    latitude: number;
    longitude: number;
};

const { width, height } = Dimensions.get('window');

type Props = {
    holeData: HoleData;
};

const CustomMarker = forwardRef<View, { color: string }>((props, ref) => (
    <View
        ref={ref}
        style={[
            styles.markerStyle,
            { backgroundColor: props.color }
        ]}
    />
));



const GolfHoleMap: React.FC<Props> = ({ holeData }) => {
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [mapRotation, setMapRotation] = useState(0);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
        })();

        const rotation = calculateMapRotation();
        setMapRotation(rotation);

    }, [holeData]);

    const handleMapPress = (event: any) => {
        const { coordinate } = event.nativeEvent;
        console.log("Pressed on map at:", coordinate);
        setUserLocation({
            coords: {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                altitude: 0,
                accuracy: 0,
                altitudeAccuracy: 0,
                heading: 0,
                speed: 0
            },
            timestamp: Date.now()
        });
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

    const groupPolygonsByType = (polygons: HoleData['polygons']) => {
        const groups: Record<string, Array<Array<{latitude: number, longitude: number}>>> = {};

        for (const polygon of polygons) {
            const surfaceType = polygon.surface_type || 'Unknown';
            if (!groups[surfaceType]) {
                groups[surfaceType] = [];
            }

            if (surfaceType === 'Woods' || surfaceType === 'Sand') {
                if (groups[surfaceType].length === 0 ||
                    !areAdjacent(groups[surfaceType][groups[surfaceType].length - 1], [{latitude: polygon.lat!, longitude: polygon.long!}])) {
                    groups[surfaceType].push([]);
                }
                groups[surfaceType][groups[surfaceType].length - 1].push({
                    latitude: polygon.lat!,
                    longitude: polygon.long!
                });
            } else {
                // For other surface types, keep all points in a single group
                if (groups[surfaceType].length === 0) {
                    groups[surfaceType].push([]);
                }
                groups[surfaceType][0].push({
                    latitude: polygon.lat!,
                    longitude: polygon.long!
                });
            }
        }

        return groups;
    };

    const areAdjacent = (group1: Array<{latitude: number, longitude: number}>,
                         group2: Array<{latitude: number, longitude: number}>): boolean => {
        for (const poly1 of group1) {
            for (const poly2 of group2) {
                const distance = Math.sqrt(
                    Math.pow(poly1.latitude - poly2.latitude, 2) +
                    Math.pow(poly1.longitude - poly2.longitude, 2)
                );
                if (distance < 0.00008) {
                    return true;
                }
            }
        }
        return false;
    };

    const calculateMapRotation = () => {
        const whiteTee = holeData.vectors.find(v => v.vector_type === 'White');
        const flag = holeData.vectors.find(v => v.vector_type === 'Flag');

        if (whiteTee && whiteTee.lat && whiteTee.long && flag && flag.lat && flag.long) {
            const bearing = calculateBearing(
                whiteTee.lat, whiteTee.long,
                flag.lat, flag.long
            );
            return bearing;
        }
        return 0;
    };

    const calculateBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
        startLat = startLat * Math.PI / 180;
        startLng = startLng * Math.PI / 180;
        destLat = destLat * Math.PI / 180;
        destLng = destLng * Math.PI / 180;

        const y = Math.sin(destLng - startLng) * Math.cos(destLat);
        const x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        let brng = Math.atan2(y, x);
        brng = brng * 180 / Math.PI;
        return (brng + 360) % 360;
    };

    const calculateRegion = () => {
        const latitudes = holeData.polygons.map(p => p.lat!).concat(holeData.vectors.map(v => v.lat!));
        const longitudes = holeData.polygons.map(p => p.long!).concat(holeData.vectors.map(v => v.long!));
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLong = Math.min(...longitudes);
        const maxLong = Math.max(...longitudes);

        const centerLat = (minLat + maxLat) / 2;
        const centerLong = (minLong + maxLong) / 2;

        const latDelta = (maxLat - minLat) * 1.2;
        const longDelta = (maxLong - minLong) * 1.2;

        return {
            latitude: centerLat,
            longitude: centerLong,
            latitudeDelta: Math.max(latDelta, longDelta * (height / width)),
            longitudeDelta: Math.max(longDelta, latDelta * (width / height)),
        };
    };

    const groupedPolygons = groupPolygonsByType(holeData.polygons);
    const region = calculateRegion();

    useEffect(() => {
        if (mapRef.current) {
            console.log("HERE");
            mapRef.current.animateCamera({
                center: region,
                pitch: 0,
                heading: mapRotation,
                altitude: 1200,
                zoom: 15
            }, { duration: 1000 }); // Animate over 1 second
        }
    }, [region, mapRotation]);

    const getMarkerColor = (vectorType: string | null): string => {
        switch (vectorType) {
            case 'Flag': return 'gold';
            case 'White': return 'white';
            case 'Red': return 'red';
            default: return 'black';
        }
    };

    console.log(mapRotation);

    if(!mapRotation) return null;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                ref={mapRef}
                initialRegion={region}
                rotateEnabled={false}
                pitchEnabled={false}
                scrollEnabled={true}
                zoomEnabled={true}
                showsCompass={false}
                customMapStyle={[
                    {
                        featureType: "all",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    },
                    {
                        featureType: "all",
                        elementType: "geometry",
                        stylers: [{ visibility: "off" }]
                    }
                ]}
                initialCamera={{
                    center: region,
                    pitch: 0,
                    heading:  mapRotation,
                    altitude: 1200,
                    zoom: 15
                }}
                onPress={handleMapPress}
            >
                {Object.entries(groupedPolygons).map(([surfaceType, polygonGroups]) =>
                    polygonGroups.map((polygonGroup, groupIndex) => (
                        <Polygon
                            key={`${surfaceType}-${groupIndex}`}
                            coordinates={polygonGroup}
                            fillColor={getSurfaceColor(surfaceType)}
                            strokeColor="black"
                            strokeWidth={1}
                            tappable={false}
                        />
                    ))
                )}
                {holeData.vectors.map((vector, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: vector.lat!, longitude: vector.long! }}
                        title={vector.vector_type || ''}
                        anchor={{ x: 0.5, y: 0.5 }}
                        tappable={false}
                    >
                        <View style={[
                            styles.markerStyle,
                            { backgroundColor: getMarkerColor(vector?.vector_type ?? null) }
                        ]} />
                    </Marker>
                ))}
            </MapView>
            {userLocation && (
                <View style={styles.coordinatesContainer}>
                    <Text style={styles.coordinatesText}>
                        Lat: {userLocation.coords.latitude.toFixed(6)}, Lon: {userLocation.coords.longitude.toFixed(6)}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    markerStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    coordinatesContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    coordinatesText: {
        fontSize: 12,
    },
});

export default GolfHoleMap;
