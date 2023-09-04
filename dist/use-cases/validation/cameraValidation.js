"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCameraLateral = exports.validateCameraAnterior = void 0;
const MessageFactory_1 = require("../utilities/MessageFactory");
const math_1 = require("../utilities/math");
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const validateCameraAnterior = (landmarks) => {
    return isUserFacingCamera(landmarks)
        ? MessageFactory_1.messageFactory.getMessage("FACING_CAMERA")
        : MessageFactory_1.messageFactory.getMessage("NOT_FACING_CAMERA");
};
exports.validateCameraAnterior = validateCameraAnterior;
const validateCameraLateral = (landmarks) => {
    return isUser90DegreesFromCamera(landmarks)
        ? MessageFactory_1.messageFactory.getMessage("90_DEGREE_FROM_CAMERA")
        : MessageFactory_1.messageFactory.getMessage("NOT_90_DEGREE_FROM_CAMERA");
};
exports.validateCameraLateral = validateCameraLateral;
// When the user is facing the camera directly, the distance between each shoulder and the nose should be roughly equal. However, if the camera is set to the side or not in front of the user, these distances will differ significantly.
const isUserFacingCamera = (landmarks, SHOULDER_SYMMETRY_THRESHOLD = 0.1, EYE_SYMMETRY_THRESHOLD = 0.02, SHOULDER_THRESHOLD = 0.2) => {
    // in case it is lateral because the fromulas down there also identify lateral as good
    const leftShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER];
    const shoulderDistance = (0, math_1.findDistanceLandmarks)(leftShoulder, rightShoulder);
    if (shoulderDistance < SHOULDER_THRESHOLD)
        return false;
    // now the formulas for anterior
    const nose = landmarks[postureProcessing_1.POSE_LANDMARKS.NOSE];
    const leftEye = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_EYE];
    const rightEye = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_EYE];
    const leftDist = (0, math_1.findDistanceLandmarks)(leftShoulder, leftEye);
    const rightDist = (0, math_1.findDistanceLandmarks)(rightShoulder, rightEye);
    const shoulderSymmetry = Math.abs(leftDist - rightDist);
    const noseToLeftEye = (0, math_1.findDistanceLandmarks)(leftEye, nose);
    const noseToRightEye = (0, math_1.findDistanceLandmarks)(rightEye, nose);
    const eyeSymmetry = Math.abs(noseToLeftEye - noseToRightEye);
    const isShoulderSymmetric = shoulderSymmetry < SHOULDER_SYMMETRY_THRESHOLD;
    const isEyeSymmetric = eyeSymmetry < EYE_SYMMETRY_THRESHOLD;
    return isShoulderSymmetric && isEyeSymmetric;
};
const isUser90DegreesFromCamera = (landmarks, DIST_SHOULDERS_THRESHOLD = 0.15, HIPS_SHOULDERS_THRESHOLD = 0.2) => {
    const leftShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftHip = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_HIP];
    const distShoulders = (0, math_1.findDistanceLandmarks)(leftShoulder, rightShoulder);
    const distHips = (0, math_1.findDistanceLandmarks)(leftHip, rightHip);
    if (distShoulders >= DIST_SHOULDERS_THRESHOLD || distHips >= HIPS_SHOULDERS_THRESHOLD) {
        return false;
    }
    return true;
};
//# sourceMappingURL=cameraValidation.js.map