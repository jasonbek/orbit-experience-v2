export type Point = { x: number; y: number };

/**
 * Calculates a point on a cubic Bezier curve at time t (0 <= t <= 1)
 * Formula: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
 */
const getCubicPoint = (t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point => {
    const cX = 3 * (p1.x - p0.x);
    const bX = 3 * (p2.x - p1.x) - cX;
    const aX = p3.x - p0.x - cX - bX;

    const cY = 3 * (p1.y - p0.y);
    const bY = 3 * (p2.y - p1.y) - cY;
    const aY = p3.y - p0.y - cY - bY;

    const x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    const y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return { x, y };
};

/**
 * Generates the specific coordinates for the 10 Canada ICI Mission Nodes.
 * Matches the SVG path coordinates defined in Trajectory.tsx.
 */
export const getTrajectoryNodes = (totalNodes: number = 10): Point[] => {
    // Coordinates match the visual curve in Trajectory.tsx
    const start = { x: 150, y: 900 };    // Earth (Launch)
    const p1 = { x: 800, y: 900 };       // Control Point 1
    const p2 = { x: 1200, y: 100 };      // Control Point 2
    const end = { x: 1700, y: 150 };     // Moon (Splashdown)

    const nodes: Point[] = [];

    for (let i = 0; i < totalNodes; i++) {
        // Distribute nodes evenly along the curve.
        // i / (totalNodes - 1) covers 0.0 to 1.0 range exactly.
        const t = i / (totalNodes - 1);
        nodes.push(getCubicPoint(t, start, p1, p2, end));
    }

    return nodes;
};
