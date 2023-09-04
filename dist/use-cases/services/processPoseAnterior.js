"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserTooCloseToTheScreen = exports.processPoseAnterior = void 0;
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const math_1 = require("../utilities/math");
const PostureErrorMessageBuilder_1 = require("../utilities/PostureErrorMessageBuilder");
const HEAD_TURNED_THRESHOLD = 0.05;
const processPoseAnterior = (receivedData, calibrations, thresholds) => __awaiter(void 0, void 0, void 0, function* () {
    const landmarks = receivedData;
    const leftShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_ELBOW];
    const leftEye = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_EYE];
    const rightEye = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_EYE];
    const head = landmarks[postureProcessing_1.POSE_LANDMARKS.NOSE];
    const areElbowsFar = areElbowsFarFromBody(leftShoulder, rightShoulder, leftElbow, rightElbow, thresholds.SHOULDER_ELBOW_DEGREE_THRESHOLD);
    const isUserClose = (0, exports.isUserTooCloseToTheScreen)(head, calibrations[postureProcessing_1.POSE_LANDMARKS.NOSE]);
    const personLeanDirection = checkIfPersonIsLeaning(leftShoulder, rightShoulder, calibrations[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER], calibrations[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER], thresholds.LEAN_THRESHOLD);
    const isHeadTurned = checkIfPersonIsTurned(head, leftShoulder, rightShoulder, HEAD_TURNED_THRESHOLD);
    const areShouldersHunched = checkAnteriorAlignment(leftShoulder, rightShoulder, calibrations[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER], calibrations[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER], thresholds.ALIGNMENT_SHOULDERS_THRESHOLD);
    const isHeadHunched = checkAnteriorAlignment(leftEye, rightEye, calibrations[postureProcessing_1.POSE_LANDMARKS.LEFT_EYE], calibrations[postureProcessing_1.POSE_LANDMARKS.RIGHT_EYE], thresholds.ALIGNMENT_EYES_THRESHOLD);
    const errorMessageBuilder = PostureErrorMessageBuilder_1.AnteriorPostureErrorMessageBuilder.getInstance().reset();
    if (!isHeadTurned) {
        errorMessageBuilder
            .addElbowsFarMessage(areElbowsFar)
            .addUserCloseMessage(isUserClose)
            .addPersonLeanMessage(personLeanDirection)
            .addHeadStraightMessage(isHeadHunched)
            .addShouldersStraightMessage(areShouldersHunched);
    }
    else {
        errorMessageBuilder.addHeadTurnedMessage(true);
    }
    const errorMessage = errorMessageBuilder.build();
    return { error: errorMessage.message ? true : false, message: errorMessage.message, details: errorMessage.details };
});
exports.processPoseAnterior = processPoseAnterior;
const areElbowsFarFromBody = (leftShoulder, rightShoulder, leftElbow, rightElbow, threshold) => {
    const leftAngle = (0, math_1.getAngleDegrees)(leftShoulder, leftElbow);
    const rightAngle = (0, math_1.getAngleDegrees)(rightShoulder, rightElbow);
    return 90 - leftAngle > threshold || rightAngle - 90 > threshold;
};
const DEPTH_CLOSE_THRESHOLD = -0.45;
const isUserTooCloseToTheScreen = (nose, calibNose) => {
    return nose.z - calibNose.z < DEPTH_CLOSE_THRESHOLD;
};
exports.isUserTooCloseToTheScreen = isUserTooCloseToTheScreen;
const checkAnteriorAlignment = (currentLandmark1, currentLandmark2, calibLandmark1, calibLandmark2, threshold) => {
    // Calculate the average y-coordinate for current and calibrated positions
    const currentAvgY = (currentLandmark1.y + currentLandmark2.y) / 2;
    const calibAvgY = (calibLandmark1.y + calibLandmark2.y) / 2;
    // Check the alignment by comparing the current average y-coordinate with the calibrated y-coordinate
    return Math.abs(currentAvgY - calibAvgY) > threshold;
};
const checkIfPersonIsTurned = (currentHead, currentShoulderLeft, currentShoulderRight, threshold) => {
    // Calculate the average x-coordinate of the shoulders
    const avgShoulderX = (currentShoulderLeft.x + currentShoulderRight.x) / 2;
    // Check if the person is turned by comparing the x-coordinate of the head with the average x-coordinate of the shoulders
    const isTurned = Math.abs(currentHead.x - avgShoulderX) > threshold;
    return isTurned;
};
const checkIfPersonIsLeaning = (currentShoulderLeft, currentShoulderRight, calibShoulderLeft, calibShoulderRight, threshold) => {
    const deviationLeft = currentShoulderLeft.x - calibShoulderLeft.x;
    const deviationRight = currentShoulderRight.x - calibShoulderRight.x;
    if (deviationLeft > threshold && deviationRight > threshold) {
        return "LEFT";
    }
    else if (deviationLeft < -threshold && deviationRight < -threshold) {
        return "RIGHT";
    }
    else {
        return "STRAIGHT";
    }
};
//# sourceMappingURL=processPoseAnterior.js.map