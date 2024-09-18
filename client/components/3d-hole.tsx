import React, { useCallback, useRef } from 'react';
import { View, PanResponder, PanResponderGestureState } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { ExpoWebGLRenderingContext } from 'expo-gl';

export default function GolfHoleViewer() {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<Renderer | null>(null);

    const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.set(0, 50, 40);
        camera.lookAt(0, 0, -30);
        cameraRef.current = camera;

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x87CEEB); // Sky blue background
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 20, 0);
        scene.add(directionalLight);

        // Rough (entire ground plane)
        const roughGeometry = new THREE.PlaneGeometry(60, 100);
        const roughMaterial = new THREE.MeshLambertMaterial({ color: 0x355E3B }); // Dark green
        const rough = new THREE.Mesh(roughGeometry, roughMaterial);
        rough.rotation.x = -Math.PI / 2;
        rough.position.set(0, -0.01, -25);
        scene.add(rough);

        // Fairway
        const fairwayShape = new THREE.Shape();
        fairwayShape.moveTo(-5, 0);
        fairwayShape.lineTo(-5, 70);
        fairwayShape.quadraticCurveTo(-5, 75, 0, 75);
        fairwayShape.quadraticCurveTo(5, 75, 5, 70);
        fairwayShape.lineTo(5, 0);
        fairwayShape.quadraticCurveTo(5, -5, 0, -5);
        fairwayShape.quadraticCurveTo(-5, -5, -5, 0);

        const fairwayGeometry = new THREE.ShapeGeometry(fairwayShape);
        const fairwayMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const fairway = new THREE.Mesh(fairwayGeometry, fairwayMaterial);
        fairway.rotation.x = -Math.PI / 2;
        fairway.position.set(0, 0.01, -35);
        scene.add(fairway);

        // Green
        const greenShape = new THREE.Shape();
        greenShape.moveTo(0, 0);
        for (let i = 0; i <= 360; i += 10) {
            const angle = i * Math.PI / 180;
            const x = 5 * Math.cos(angle);
            const y = 5 * Math.sin(angle);
            greenShape.lineTo(x, y);
        }

        const greenGeometry = new THREE.ShapeGeometry(greenShape);
        const greenMaterial = new THREE.MeshLambertMaterial({ color: 0x008000 });
        const green = new THREE.Mesh(greenGeometry, greenMaterial);
        green.rotation.x = -Math.PI / 2;
        green.position.set(0, 0.02, -72);
        scene.add(green);

        // Tee Box
        const teeBoxGeometry = new THREE.BoxGeometry(4, 0.1, 3);
        const teeBoxMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const teeBox = new THREE.Mesh(teeBoxGeometry, teeBoxMaterial);
        teeBox.position.set(0, 0.05, 2);
        scene.add(teeBox);

        // Flag
        const flagpoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const flagpoleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const flagpole = new THREE.Mesh(flagpoleGeometry, flagpoleMaterial);
        flagpole.position.set(0, 1.5, -72);
        scene.add(flagpole);

        const flagGeometry = new THREE.PlaneGeometry(1, 0.5);
        const flagMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(0.5, 2.5, -72);
        flag.rotation.y = Math.PI / 2;
        scene.add(flag);

        // Trees
        const treeGeometry = new THREE.ConeGeometry(1, 4, 8);
        const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });

        for (let i = 0; i < 20; i++) {
            const treeLeft = new THREE.Mesh(treeGeometry, treeMaterial);
            treeLeft.position.set(-10 - Math.random() * 10, 2, -10 - i * 5);
            scene.add(treeLeft);

            const treeRight = new THREE.Mesh(treeGeometry, treeMaterial);
            treeRight.position.set(10 + Math.random() * 10, 2, -10 - i * 5);
            scene.add(treeRight);
        }

        const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    }, []);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
            if (cameraRef.current) {
                cameraRef.current.position.x -= gestureState.dx * 0.05;
                cameraRef.current.position.z += gestureState.dy * 0.05;
                cameraRef.current.lookAt(0, 0, -30);
            }
        },
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }} {...panResponder.panHandlers}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
        </View>
    );
}
