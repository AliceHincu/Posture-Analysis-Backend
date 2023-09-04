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
exports.processPoseLateral = void 0;
const PostureErrorMessageBuilder_1 = require("../utilities/PostureErrorMessageBuilder");
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const math_1 = require("../utilities/math");
const processPoseLateral = (receivedData, thresholds) => __awaiter(void 0, void 0, void 0, function* () {
    const landmarks = receivedData;
    const leftShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftEar = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_EAR];
    const rightEar = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_EAR];
    const leftHip = landmarks[postureProcessing_1.POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[postureProcessing_1.POSE_LANDMARKS.RIGHT_HIP];
    // calculate angles.
    const neckInclination = (0, math_1.findAngle2)(leftShoulder.x, leftShoulder.y, leftEar.x, leftEar.y);
    const torsoInclination = (0, math_1.findAngle2)(leftHip.x, leftHip.y, leftShoulder.x, leftShoulder.y);
    const isHeadHunched = neckInclination > thresholds.NECK_INCLINATION_THRESHOLD;
    const areShouldersHunched = torsoInclination > thresholds.TORSO_INCLINATION_THRESHOLD;
    const errorMessageBuilder = PostureErrorMessageBuilder_1.LateralPostureErrorMessageBuilder.getInstance().reset();
    errorMessageBuilder.addHeadStraightMessage(isHeadHunched).addShouldersStraightMessage(areShouldersHunched);
    const errorMessage = errorMessageBuilder.build();
    return { error: errorMessage.message ? true : false, message: errorMessage.message, details: errorMessage.details };
});
exports.processPoseLateral = processPoseLateral;
//# sourceMappingURL=processPoseLateral.js.map