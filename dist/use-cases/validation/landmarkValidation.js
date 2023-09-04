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
exports.doLandmarksExist = exports.validateReceivedLandmarks = exports.validateLandmarks = void 0;
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const MessageFactory_1 = require("../utilities/MessageFactory");
const validateLandmarks = (data) => {
    if ((0, exports.doLandmarksExist)(data)) {
        return MessageFactory_1.messageFactory.getMessage("LANDMARKS_VISIBLE");
    }
    else {
        return MessageFactory_1.messageFactory.getMessage("LANDMARKS_NOT_VISIBLE");
    }
};
exports.validateLandmarks = validateLandmarks;
const validateReceivedLandmarks = (receivedLandmarks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postureProcessing_1.LandmarkDictSchema.validate({ landmarks: receivedLandmarks });
        const validationResults = (0, exports.validateLandmarks)(receivedLandmarks);
        if (validationResults.error)
            return validationResults;
        return MessageFactory_1.messageFactory.getMessage("LANDMARKS_VISIBLE");
    }
    catch (err) {
        return { error: true, message: "Something went wrong." };
    }
});
exports.validateReceivedLandmarks = validateReceivedLandmarks;
const VISIBILITY_THRESHOLD = 0.75;
/**
 * Check the visibility of the landmarks.
 * If they are not visible, then the posture processing should stop.
 * @param {LandmarkDict} landmarks - landmarks returned by mediapipe pose
 * @returns - true if every landmark is visible, false otherwise
 */
const doLandmarksExist = (landmarks) => {
    return !Object.entries(landmarks).some(([key, landmark]) => {
        // Exclude elbows from the visibility check
        if (key == postureProcessing_1.POSE_LANDMARKS.LEFT_ELBOW.toString() || key == postureProcessing_1.POSE_LANDMARKS.RIGHT_ELBOW.toString()) {
            return false;
        }
        return landmark.visibility < VISIBILITY_THRESHOLD;
    });
};
exports.doLandmarksExist = doLandmarksExist;
//# sourceMappingURL=landmarkValidation.js.map