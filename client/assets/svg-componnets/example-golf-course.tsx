import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G } from 'react-native-svg';
import * as Location from 'expo-location';

const GolfHoleSVG: React.FC = () => {
    const [userPosition, setUserPosition] = useState({ cx: 499.48127391079, cy: 968 });

    useEffect(() => {
        const getLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            updatePosition(location.coords.latitude, location.coords.longitude);

            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 1 },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    updatePosition(latitude, longitude);
                }
            );
        };

        const updatePosition = (latitude: number, longitude: number) => {
            // Here you'd add logic to transform GPS coordinates to SVG coordinates
            const newCx = 499.48127391079; // Replace with your logic
            const newCy = 968; // Replace with your logic

            setUserPosition({ cx: newCx, cy: newCy });
        };

        getLocationPermission();
    }, []);

    return (
        <View>
            <Svg viewBox="200 110 600 900" preserveAspectRatio="xMidYMid meet">
                <Defs>
                    <LinearGradient id="fairwayGradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#3d8c40" stopOpacity="0.8" />
                        <Stop offset="1" stopColor="#4caf50" stopOpacity="0.8" />
                    </LinearGradient>

                </Defs>

                <G opacity="0.9">
                    <Path
                        fill="url(#fairwayGradient)"
                        d="M 486.1074,143.2104 S485.3861,168.4341 485.3861,168.4341 486.7701,192.329 486.7701,192.329 487.5792,244.4683 487.5792,244.4683 485.999,271.0461 485.999,271.0461 483.3645,308.5758 483.3645,308.5758 483.032,345.3293 483.032,345.3293 482.5686,368.0893 482.5686,368.0893 481.8361,393.8614 481.8361,393.8614 481.7951,426.5059 481.7951,426.5059 481.0973,460.783 481.0973,460.783 480.2643,491.491 480.2643,491.491 481.3836,507.9736 481.3836,507.9736 482.8445,517.8792 482.8445,517.8792 485.5575,527.536 485.5575,527.536 488.1298,533.898 488.1298,533.898 491.7351,540.5553 491.7351,540.5553 497.4347,546.4323 497.4347,546.4323 503.5017,549.5734 503.5017,549.5734 509.6356,549.424 509.6356,549.424 513.6106,548.1332 513.6106,548.1332 518.4557,544.9399 518.4557,544.9399 521.2289,541.4301 521.2289,541.4301 524.0775,534.2183 524.0775,534.2183 526.1398,524.7959 526.1398,524.7959 526.9628,504.7865 526.9628,504.7865 526.4117,450.1836 526.4117,450.1836 526.6717,416.9949 526.6717,416.9949 526.7742,381.334 526.7742,381.334 528.7798,344.0659 528.7798,344.0659 527.4349,318.2515 527.4349,318.2515 528.1718,282.0549 528.1718,282.0549 527.5469,220.8665 527.5469,220.8665 527.0294,164.6182 527.0294,164.6182 527.2646,112.2259 527.2646,112.2259 525.3268,105.3282 525.3268,105.3282 514.59,91.6675 514.59,91.6675 509.0368,88.8111 509.0368,88.8111 503.8544,88.157 503.8544,88.157 497.1843,89.1185 497.1843,89.1185 492.5582,91.7676 492.5582,91.7676 489.5549,96.3701 489.5549,96.3701 487.0576,106.7438 487.0576,106.7438 485.9599,130.0395 485.9599,130.0395Z"
                    />
                    <Path
                        fill="#66BB6A"
                        opacity="0.8"
                        d="M 496.0712,59.2165 S498.0593,63.6463 498.0593,63.6463 500.6874,67.2661 500.6874,67.2661 503.7588,69.5233 503.7588,69.5233 507.4647,71.2447 507.4647,71.2447 510.7941,71.0381 510.7941,71.0381 514.7747,69.4732 514.7747,69.4732 517.7166,67.8871 517.7166,67.8871 520.9109,64.1115 520.9109,64.1115 523.8974,60.3317 523.8974,60.3317 525.4298,56.5222 525.4298,56.5222 527.4223,50.5275 527.4223,50.5275 527.9215,46.4227 527.9215,46.4227 528.1683,44.5075 528.1683,44.5075 528.0443,40.39 528.0443,40.39 526.5219,33.5007 526.5219,33.5007 523.4895,29.324 523.4895,29.324 520.2494,25.1431 520.2494,25.1431 516.9814,22.3333 516.9814,22.3333 513.0733,20.3334 513.0733,20.3334 510.1705,20 510.1705,20 506.6222,20.7508 506.6222,20.7508 503.4614,22.8811 503.4614,22.8811 500.6714,27.2135 500.6714,27.2135 498.4712,33.204 498.4712,33.204 496.4675,39.7472 496.4675,39.7472 495.7159,46.0415 495.7159,46.0415 495.2167,50.1462 495.2167,50.1462 494.7231,53.9768 494.7231,53.9768Z"
                    />
                    <Path
                        fill="#F0E68C"
                        opacity="0.8"
                        d="M 530.3717,65.0716 S531.7366,69.4887 531.7366,69.4887 534.4373,69.5437 534.4373,69.5437 536.3795,66.0169 536.3795,66.0169 539.4219,59.4949 539.4219,59.4949 539.7357,54.289 539.7357,54.289 539.1906,50.4373 539.1906,50.4373 536.9334,49.0197 536.9334,49.0197 535.0525,49.5301 535.0525,49.5301 533.9357,53.3479 533.9357,53.3479 531.9599,58.52 531.9599,58.52 531.2809,61.2495 531.2809,61.2495Z"
                    />
                </G>

                <G id="map-points">
                    <Circle cx="499.48127391079" cy="34.43807485679" r="5" fill="white" />
                    <Circle cx="499.48127391079" cy="968" r="5" fill="white" />
                    <Circle cx="517.66850664284" cy="789.23252337531" r="5" fill="white" />
                </G>

                {/* User's Position */}
                <Circle cx={userPosition.cx} cy={userPosition.cy} r="10" fill="url(#userPositionGradient)" />
                <Circle cx={userPosition.cx} cy={userPosition.cy} r="10" stroke="rgba(0, 122, 255, 0.3)" strokeWidth="5" fill="transparent" />
                <Circle cx={userPosition.cx} cy={userPosition.cy} r="3" fill="rgba(0, 122, 255, 1)" />
            </Svg>
        </View>
    );
};

export default GolfHoleSVG;
