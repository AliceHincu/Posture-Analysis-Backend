import { messageFactory } from "../utilities/MessageFactory";
import { ResponseData } from "../types/communicationSocket";
import { LandmarkDict, POSE_LANDMARKS, ThresholdsAnterior } from "../types/postureProcessing";
import { getAngleDegrees } from "./math";
import { AnteriorPostureErrorMessageBuilder } from "../utilities/PostureErrorMessageBuilder";

const HEAD_TURNED_THRESHOLD = 0.05;

export const processPoseAnterior = async (
  receivedData: LandmarkDict,
  calibrations: LandmarkDict,
  thresholds: ThresholdsAnterior
): Promise<ResponseData> => {
  const landmarks = receivedData;
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
  const leftEye = landmarks[POSE_LANDMARKS.LEFT_EYE];
  const rightEye = landmarks[POSE_LANDMARKS.RIGHT_EYE];
  const head = landmarks[POSE_LANDMARKS.NOSE];

  const areElbowsFar = areElbowsFarFromBody(
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    thresholds.SHOULDER_ELBOW_DEGREE_THRESHOLD
  );
  const isUserClose = isUserTooCloseToTheScreen(head, calibrations[POSE_LANDMARKS.NOSE]);
  const personLeanDirection = checkIfPersonIsLeaning(
    leftShoulder,
    rightShoulder,
    calibrations[POSE_LANDMARKS.LEFT_SHOULDER],
    calibrations[POSE_LANDMARKS.RIGHT_SHOULDER],
    thresholds.LEAN_THRESHOLD
  );
  const isHeadTurned = checkIfPersonIsTurned(head, leftShoulder, rightShoulder, HEAD_TURNED_THRESHOLD);
  const areShouldersHunched = checkAnteriorAlignment(
    leftShoulder,
    rightShoulder,
    calibrations[POSE_LANDMARKS.LEFT_SHOULDER],
    calibrations[POSE_LANDMARKS.RIGHT_SHOULDER],
    thresholds.ALIGNMENT_SHOULDERS_THRESHOLD
  );
  const isHeadHunched = checkAnteriorAlignment(
    leftEye,
    rightEye,
    calibrations[POSE_LANDMARKS.LEFT_EYE],
    calibrations[POSE_LANDMARKS.RIGHT_EYE],
    thresholds.ALIGNMENT_EYES_THRESHOLD
  );

  const errorMessageBuilder = AnteriorPostureErrorMessageBuilder.getInstance().reset();

  if (!isHeadTurned) {
    errorMessageBuilder
      .addElbowsFarMessage(areElbowsFar)
      .addUserCloseMessage(isUserClose)
      .addPersonLeanMessage(personLeanDirection)
      .addHeadStraightMessage(isHeadHunched)
      .addShouldersStraightMessage(areShouldersHunched);
  } else {
    errorMessageBuilder.addHeadTurnedMessage(true);
  }

  const errorMessage = errorMessageBuilder.build();
  return { error: errorMessage.message ? true : false, message: errorMessage.message, details: errorMessage.details };
};

const areElbowsFarFromBody = (
  leftShoulder: any,
  rightShoulder: any,
  leftElbow: any,
  rightElbow: any,
  threshold: number
): boolean => {
  const leftAngle = getAngleDegrees(leftShoulder, leftElbow);
  const rightAngle = getAngleDegrees(rightShoulder, rightElbow);

  return 90 - leftAngle > threshold || rightAngle - 90 > threshold;
};

const DEPTH_CLOSE_THRESHOLD = -0.45;
export const isUserTooCloseToTheScreen = (nose: any, calibNose: any): boolean => {
  return nose.z - calibNose.z < DEPTH_CLOSE_THRESHOLD;
};

const checkAnteriorAlignment = (
  currentLandmark1: any,
  currentLandmark2: any,
  calibLandmark1: any,
  calibLandmark2: any,
  threshold: number
) => {
  // Calculate the average y-coordinate for current and calibrated positions
  const currentAvgY = (currentLandmark1.y + currentLandmark2.y) / 2;
  const calibAvgY = (calibLandmark1.y + calibLandmark2.y) / 2;

  // Check the alignment by comparing the current average y-coordinate with the calibrated y-coordinate
  return Math.abs(currentAvgY - calibAvgY) > threshold;
};

const checkIfPersonIsTurned = (
  currentHead: any,
  currentShoulderLeft: any,
  currentShoulderRight: any,
  threshold: number
) => {
  // Calculate the average x-coordinate of the shoulders
  const avgShoulderX = (currentShoulderLeft.x + currentShoulderRight.x) / 2;

  // Check if the person is turned by comparing the x-coordinate of the head with the average x-coordinate of the shoulders
  const isTurned = Math.abs(currentHead.x - avgShoulderX) > threshold;

  return isTurned;
};

const checkIfPersonIsLeaning = (
  currentShoulderLeft: any,
  currentShoulderRight: any,
  calibShoulderLeft: any,
  calibShoulderRight: any,
  threshold: number
): "LEFT" | "RIGHT" | "STRAIGHT" => {
  const deviationLeft = currentShoulderLeft.x - calibShoulderLeft.x;
  const deviationRight = currentShoulderRight.x - calibShoulderRight.x;

  if (deviationLeft > threshold && deviationRight > threshold) {
    return "LEFT";
  } else if (deviationLeft < -threshold && deviationRight < -threshold) {
    return "RIGHT";
  } else {
    return "STRAIGHT";
  }
};
