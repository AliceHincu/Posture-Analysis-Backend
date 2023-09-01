import { Landmark } from "entities/types/postureProcessing";

/**
 * Determine the offset distance between two points.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
export const findDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return dist;
};

export const findDistanceLandmarks = (first: Landmark, second: Landmark): number => {
  return findDistance(first.x, first.y, second.x, second.y);
};

/**
 * Calculate angle between two points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
export const findAngle2 = (x1: number, y1: number, x2: number, y2: number): number => {
  const theta = Math.acos(((y2 - y1) * -y1) / (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * y1));
  const degree = Math.round(180 / Math.PI) * theta;
  return degree;
};

/**
 * Calculates the angle ABC (in degrees) between three points A, B, and C
 * https://www.cuemath.com/geometry/angle-between-vectors/
 * @param {Object} A - The first point, with x and y coordinates
 * @param {Object} B - The second (middle) point, with x and y coordinates
 * @param {Object} C - The third point, with x and y coordinates
 * @returns {number} - The angle in degrees
 */
export const findAngle3 = (A: any, B: any, C: any) => {
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

export const getAngleDegrees = (pointA: any, pointB: any): number => {
  const deltaY = pointB.y - pointA.y;
  const deltaX = pointB.x - pointA.x;
  return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
};
