import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Asset } from 'expo-asset';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { parseSVG, makeAbsolute, Command } from 'svg-path-parser';

export default function GolfHoleViewer() {
    const rendererRef = useRef<Renderer | null>(null);
    const requestIdRef = useRef<number | null>(null);

    const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        // Add a test cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-2, 0, 0);
        scene.add(cube);

        try {
            const asset = Asset.fromModule(require('../assets/images/golf-hole.svg'));
            await asset.downloadAsync();
            const svgString = await fetch(asset.uri).then(response => response.text());

            console.log('SVG String:', svgString);

            const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;
            let match;
            const group = new THREE.Group();
            let pathCount = 0;

            while ((match = pathRegex.exec(svgString)) !== null) {
                pathCount++;
                const pathData = match[1];
                console.log('Path Data:', pathData);

                const parsedPath = makeAbsolute(parseSVG(pathData));
                const shape = new THREE.Shape();

                parsedPath.forEach((command: Command, index: number) => {
                    if (index === 0 && 'x' in command && 'y' in command) {
                        shape.moveTo(command.x, command.y);
                    } else if (command.code === 'L' && 'x' in command && 'y' in command) {
                        shape.lineTo(command.x, command.y);
                    } else if (command.code === 'C' && 'x' in command && 'y' in command && 'x1' in command && 'y1' in command && 'x2' in command && 'y2' in command) {
                        shape.bezierCurveTo(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
                    }
                });

                const geometry = new THREE.ShapeGeometry(shape);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    side: THREE.DoubleSide,
                    wireframe: true  // Set to false to see solid shapes
                });
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }

            console.log('Total paths processed:', pathCount);

            group.scale.set(0.01, -0.01, 0.01);  // Flip Y-axis and scale down
            scene.add(group);

            const box = new THREE.Box3().setFromObject(group);
            console.log('Group bounding box:', box.min, box.max);

            const center = box.getCenter(new THREE.Vector3());
            group.position.sub(center);  // Center the group

        } catch (error) {
            console.error('Error loading SVG:', error);
        }

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0xffffff);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            requestIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();

        return () => {
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <GLView
                style={{ flex: 1 }}
                onContextCreate={onContextCreate}
            />
        </View>
    );
}
