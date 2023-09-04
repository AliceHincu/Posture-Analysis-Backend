"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAngleDegrees = exports.findAngle3 = exports.findAngle2 = exports.findDistanceLandmarks = exports.findDistance = void 0;
/**
 * Determine the offset distance between two points.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const findDistance = (x1, y1, x2, y2) => {
    const dist = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return dist;
};
exports.findDistance = findDistance;
const findDistanceLandmarks = (first, second) => {
    return (0, exports.findDistance)(first.x, first.y, second.x, second.y);
};
exports.findDistanceLandmarks = findDistanceLandmarks;
/**
 * Calculate angle between two points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const findAngle2 = (x1, y1, x2, y2) => {
    const theta = Math.acos(((y2 - y1) * -y1) / (Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) * y1));
    const degree = Math.round(180 / Math.PI) * theta;
    return degree;
};
exports.findAngle2 = findAngle2;
/**
 * Calculates the angle ABC (in degrees) between three points A, B, and C
 * https://www.cuemath.com/geometry/angle-between-vectors/
 * @param {Object} A - The first point, with x and y coordinates
 * @param {Object} B - The second (middle) point, with x and y coordinates
 * @param {Object} C - The third point, with x and y coordinates
 * @returns {number} - The angle in degrees
 */
const findAngle3 = (A, B, C) => {
    // get the 2 vectors that form the angle
    const BAx = A.x - B.x;
    const BAy = A.y - B.y;
    const BCx = C.x - B.x;
    const BCy = C.y - B.y;
    // Calculate the dot product of vectors BA and BC
    const dotProduct = BAx * BCx + BAy * BCy;
    // Calculate the magnitude of vectors BA and BC
    const magnitudeBA = Math.sqrt(BAx * BAx + BAy * BAy); // |BA|
    const magnitudeBC = Math.sqrt(BCx * BCx + BCy * BCy); // |BC|
    // Calculate the angle using the dot product and magnitudes
    const angleInRadians = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
    // Convert the angle to degrees
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return angleInDegrees;
};
exports.findAngle3 = findAngle3;
const getAngleDegrees = (pointA, pointB) => {
    const deltaY = pointB.y - pointA.y;
    const deltaX = pointB.x - pointA.x;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
};
exports.getAngleDegrees = getAngleDegrees;
//# sourceMappingURL=math.js.map