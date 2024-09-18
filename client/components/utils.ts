import * as THREE from 'three';
import {parseSVG} from "svg-path-parser";
import {Asset} from "expo-asset";

type Point = {
    x: number;
    y: number;
};

type CubicBezierCurve = [number, number, number, number, number, number, number, number];

type Path = {
    d: string;
    color?: string;
    depth?: number;
};

type Tee = {
    x: number;
    y: number;
    z: number;
    color: string;
};

type Flag = {
    x: number;
    y: number;
    z: number;
};



export const svgPathToShape = (pathData: string): THREE.Shape => {
    const commands = parseSVG(pathData);
    const shape = new THREE.Shape();
    let currentPoint = new THREE.Vector2(0, 0);
    let firstPoint: THREE.Vector2 | null = null;
    let lastControlPoint: THREE.Vector2 | null = null;

    commands.forEach((command) => {
        const { code } = command;
        console.log('CODE:', code, 'COMMAND:', command);
        switch (code) {
            case 'M':
                if (command.x !== undefined && command.y !== undefined) {
                    shape.moveTo(command.x, -command.y);
                    currentPoint.set(command.x, -command.y);
                    if (!firstPoint) firstPoint = currentPoint.clone();
                }
                break;
            case 'L':
                if (command.x !== undefined && command.y !== undefined) {
                    shape.lineTo(command.x, -command.y);
                    currentPoint.set(command.x, -command.y);
                }
                break;
            case 'H':
                if (command.x !== undefined) {
                    shape.lineTo(command.x, currentPoint.y);
                    currentPoint.set(command.x, currentPoint.y);
                }
                break;
            case 'V':
                if (command.y !== undefined) {
                    shape.lineTo(currentPoint.x, -command.y);
                    currentPoint.set(currentPoint.x, -command.y);
                }
                break;
            case 'C':
                if (
                    command.x1 !== undefined &&
                    command.y1 !== undefined &&
                    command.x2 !== undefined &&
                    command.y2 !== undefined &&
                    command.x !== undefined &&
                    command.y !== undefined
                ) {
                    shape.bezierCurveTo(
                        command.x1,
                        -command.y1,
                        command.x2,
                        -command.y2,
                        command.x,
                        -command.y
                    );
                    currentPoint.set(command.x, -command.y);
                    lastControlPoint = new THREE.Vector2(command.x2, -command.y2);
                }
                break;
            case 'S':
                if (
                    command.x2 !== undefined &&
                    command.y2 !== undefined &&
                    command.x !== undefined &&
                    command.y !== undefined
                ) {
                    const cp1 = lastControlPoint
                        ? currentPoint
                            .clone()
                            .multiplyScalar(2)
                            .sub(lastControlPoint)
                        : currentPoint.clone();
                    shape.bezierCurveTo(
                        cp1.x,
                        cp1.y,
                        command.x2,
                        -command.y2,
                        command.x,
                        -command.y
                    );
                    currentPoint.set(command.x, -command.y);
                    lastControlPoint = new THREE.Vector2(command.x2, -command.y2);
                }
                break;
            case 'Q':
                if (
                    command.x1 !== undefined &&
                    command.y1 !== undefined &&
                    command.x !== undefined &&
                    command.y !== undefined
                ) {
                    shape.quadraticCurveTo(
                        command.x1,
                        -command.y1,
                        command.x,
                        -command.y
                    );
                    currentPoint.set(command.x, -command.y);
                    lastControlPoint = new THREE.Vector2(command.x1, -command.y1);
                }
                break;
            case 'T':
                if (command.x !== undefined && command.y !== undefined) {
                    const cp = lastControlPoint
                        ? currentPoint
                            .clone()
                            .multiplyScalar(2)
                            .sub(lastControlPoint)
                        : currentPoint.clone();
                    shape.quadraticCurveTo(cp.x, cp.y, command.x, -command.y);
                    currentPoint.set(command.x, -command.y);
                    lastControlPoint = cp;
                }
                break;
            case 'A':
                if (
                    command.rx !== undefined &&
                    command.ry !== undefined &&
                    command.xAxisRotation !== undefined &&
                    command.largeArc !== undefined &&
                    command.sweep !== undefined &&
                    command.x !== undefined &&
                    command.y !== undefined
                ) {
                    const { rx, ry, xAxisRotation, largeArc, sweep, x, y } = command;
                    const curves = svgArcToCubicCurves(
                        currentPoint.x,
                        currentPoint.y,
                        x,
                        -y,
                        rx,
                        ry,
                        xAxisRotation,
                        largeArc,
                        sweep
                    );
                    curves.forEach((curve) => {
                        shape.bezierCurveTo(
                            curve[2],
                            curve[3],
                            curve[4],
                            curve[5],
                            curve[6],
                            curve[7]
                        );
                    });
                    currentPoint.set(x, -y);
                }
                break;
            case 'Z':
                shape.closePath();
                if (firstPoint) {
                    currentPoint = firstPoint.clone();
                }
                break;
            default:
                console.warn(`Command ${code} not supported.`);
        }
    });

    return shape;
};

// Converts an SVG elliptical arc to a series of cubic Bézier curves
export const svgArcToCubicCurves = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rx: number,
    ry: number,
    angle: number,
    largeArcFlag: boolean,
    sweepFlag: boolean
): CubicBezierCurve[] => {
    const curves: CubicBezierCurve[] = [];

    if (rx === 0 || ry === 0) {
        curves.push([x1, y1, x2, y2, x2, y2, x2, y2]);
        return curves;
    }

    const rad: number = (Math.PI / 180) * angle;
    const cos: number = Math.cos(rad);
    const sin: number = Math.sin(rad);

    const dx2: number = (x1 - x2) / 2;
    const dy2: number = (y1 - y2) / 2;

    const x1p: number = cos * dx2 + sin * dy2;
    const y1p: number = -sin * dx2 + cos * dy2;

    let rxSq: number = rx * rx;
    let rySq: number = ry * ry;
    let x1pSq: number = x1p * x1p;
    let y1pSq: number = y1p * y1p;

    let factor: number = Math.sqrt(
        (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) /
        (rxSq * y1pSq + rySq * x1pSq)
    );

    if (largeArcFlag === sweepFlag) factor = -factor;
    if (isNaN(factor)) factor = 0;

    const cxp: number = (factor * rx * y1p) / ry;
    const cyp: number = (factor * -ry * x1p) / rx;

    const cx: number = cos * cxp - sin * cyp + (x1 + x2) / 2;
    const cy: number = sin * cxp + cos * cyp + (y1 + y2) / 2;

    const startAngle: number = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
    const endAngle: number = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);

    let deltaAngle: number = endAngle - startAngle;
    if (!sweepFlag && deltaAngle > 0) {
        deltaAngle -= 2 * Math.PI;
    } else if (sweepFlag && deltaAngle < 0) {
        deltaAngle += 2 * Math.PI;
    }

    const segments: number = Math.ceil(Math.abs(deltaAngle / (Math.PI / 2)));
    const delta: number = deltaAngle / segments;

    for (let i = 0; i < segments; i++) {
        const theta1: number = startAngle + i * delta;
        const theta2: number = startAngle + (i + 1) * delta;

        const t: number = (4 / 3) * Math.tan((theta2 - theta1) / 4);

        const x1Segment: number = rx * Math.cos(theta1);
        const y1Segment: number = ry * Math.sin(theta1);
        const x2Segment: number = rx * Math.cos(theta2);
        const y2Segment: number = ry * Math.sin(theta2);

        const cp1x: number = x1Segment - t * y1Segment;
        const cp1y: number = y1Segment + t * x1Segment;
        const cp2x: number = x2Segment + t * y2Segment;
        const cp2y: number = y2Segment - t * x2Segment;

        const cp1: Point = {
            x: cos * cp1x - sin * cp1y + cx,
            y: sin * cp1x + cos * cp1y + cy,
        };
        const cp2: Point = {
            x: cos * cp2x - sin * cp2y + cx,
            y: sin * cp2x + cos * cp2y + cy,
        };
        const endpoint: Point = {
            x: cos * x2Segment - sin * y2Segment + cx,
            y: sin * x2Segment + cos * y2Segment + cy,
        };

        curves.push([
            x1, y1,        // Start point
            cp1.x, cp1.y,  // First control point
            cp2.x, cp2.y,  // Second control point
            endpoint.x, endpoint.y // End point
        ]);
    }

    return curves;
};

export async function parseGolfSVG(svg: Document): Promise<{ paths: Path[], tees: Tee[], flags: Flag[] }> {
    const asset = Asset.fromModule(require('../assets/images/golf-hole.svg'));
    await asset.downloadAsync();
    const svgString = await fetch(asset.uri).then(response => response.text());
    const paths: Path[] = [];
    const tees: Tee[] = [];
    const flags: Flag[] = [];

    // Parse paths
    const pathElements = svg.querySelectorAll('path');
    pathElements.forEach(pathElement => {
        const d = pathElement.getAttribute('d');
        if (d) {
            const className = pathElement.getAttribute('class');
            let color = '#808080';
            let depth = 1;

            // Determine the color and depth based on the class
            switch (className) {
                case 'fairway':
                    color = '#90EE90';
                    depth = 5;
                    break;
                case 'green':
                    color = '#66CDAA';
                    depth = 2;
                    break;
                case 'sand':
                    color = '#F4A460';
                    depth = 2;
                    break;
                case 'woods':
                    color = '#006400';
                    depth = 3;
                    break;
                case 'water':
                    color = '#4169E1';
                    depth = 1;
                    break;
                case 'stone':
                    color = '#A9A9A9';
                    depth = 4;
                    break;
            }

            paths.push({ d, color, depth });
        }
    });

    // Parse flags
    const flagElements = svg.querySelectorAll('use[href="#flag-icon"]');
    flagElements.forEach(flagElement => {
        const x = parseFloat(flagElement.getAttribute('x') || '0');
        const y = parseFloat(flagElement.getAttribute('y') || '0');
        flags.push({ x, y, z: 0 });
    });

    // Parse tees
    const teeElements = svg.querySelectorAll('use[href="#tee-icon"]');
    teeElements.forEach(teeElement => {
        const x = parseFloat(teeElement.getAttribute('x') || '0');
        const y = parseFloat(teeElement.getAttribute('y') || '0');
        let color = '#FFFFFF';

        if (teeElement.id === 'red') {
            color = '#FF0000';
        } else if (teeElement.id === 'white') {
            color = '#FFFFFF';
        }

        tees.push({ x, y, z: 0, color });
    });

    return { paths, tees, flags };
}


