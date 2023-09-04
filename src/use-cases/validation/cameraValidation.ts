import { messageFactory } from "../utilities/MessageFactory";
import { findAngle3, findDistance, findDistanceLandmarks } from "../utilities/math";
import { LandmarkDict, POSE_LANDMARKS } from "../../entities/types/postureProcessing";

export const validateCameraAnterior = (landmarks: LandmarkDict) => {
  return isUserFacingCamera(landmarks)
    ? messageFactory.getMessage("FACING_CAMERA")
    : messageFactory.getMessage("NOT_FACING_CAMERA");
};

export const validateCameraLateral = (landmarks: LandmarkDict) => {
  return isUser90DegreesFromCamera(landmarks)
    ? messageFactory.getMessage("90_DEGREE_FROM_CAMERA")
    : messageFactory.getMessage("NOT_90_DEGREE_FROM_CAMERA");
};

// When the user is facing the camera directly, the distance between each shoulder and the nose should be roughly equal. However, if the camera is set to the side or not in front of the user, these distances will differ significantly.
const isUserFacingCamera = (
  landmarks: LandmarkDict,
  SHOULDER_SYMMETRY_THRESHOLD = 0.1,
  EYE_SYMMETRY_THRESHOLD = 0.02,
  SHOULDER_THRESHOLD = 0.2
): boolean => {
  // in case it is lateral because the fromulas down there also identify lateral as good
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const shoulderDistance = findDistanceLandmarks(leftShoulder, rightShoulder);
  if (shoulderDistance < SHOULDER_THRESHOLD) return false;

  // now the formulas for anterior
  const nose = landmarks[POSE_LANDMARKS.NOSE];
  const leftEye = landmarks[POSE_LANDMARKS.LEFT_EYE];
  const rightEye = landmarks[POSE_LANDMARKS.RIGHT_EYE];

  const leftDist = findDistanceLandmarks(leftShoulder, leftEye);
  const rightDist = findDistanceLandmarks(rightShoulder, rightEye);
  const shoulderSymmetry = Math.abs(leftDist - rightDist);

  const noseToLeftEye = findDistanceLandmarks(leftEye, nose);
  const noseToRightEye = findDistanceLandmarks(rightEye, nose);
  const eyeSymmetry = Math.abs(noseToLeftEye - noseToRightEye);

  const isShoulderSymmetric = shoulderSymmetry < SHOULDER_SYMMETRY_THRESHOLD;
  const isEyeSymmetric = eyeSymmetry < EYE_SYMMETRY_THRESHOLD;
  return isShoulderSymmetric && isEyeSymmetric;
};

const isUser90DegreesFromCamera = (
  landmarks: LandmarkDict,
  DIST_SHOULDERS_THRESHOLD = 0.15,
  HIPS_SHOULDERS_THRESHOLD = 0.2
) => {
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

  const distShoulders = findDistanceLandmarks(leftShoulder, rightShoulder);
  const distHips = findDistanceLandmarks(leftHip, rightHip);

  if (distShoulders >= DIST_SHOULDERS_THRESHOLD || distHips >= HIPS_SHOULDERS_THRESHOLD) {
    return false;
  }
  return true;
};
