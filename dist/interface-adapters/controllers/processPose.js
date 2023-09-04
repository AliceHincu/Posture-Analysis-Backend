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
exports.handleAnalyzeCamera = exports.handleAnalyzePosture = void 0;
const landmarkValidation_1 = require("../../use-cases/validation/landmarkValidation");
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const processPoseAnterior_1 = require("../../use-cases/services/processPoseAnterior");
const processPoseLateral_1 = require("../../use-cases/services/processPoseLateral");
const cameraValidation_1 = require("../../use-cases/validation/cameraValidation");
/**
 * Analyzes the posture of the client
 * @param data data received from client
 * @param socket socket of the client
 * @param socketDataMap map that holds extra properties for each socket like the posture view chosen by the client
 * @returns {ResponseData} emits back to the client the response
 */
const handleAnalyzePosture = (data, socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    const socketData = socketDataMap.get(socket.id);
    const validationPoseResults = yield (0, landmarkValidation_1.validateReceivedLandmarks)(data);
    if (validationPoseResults.error) {
        addErrorFrame(socketData);
        return validationPoseResults;
    } // error frame
    let responseData;
    const { postureView, calibration, thresholds } = socketData;
    if (postureView === postureProcessing_1.PostureView.ANTERIOR) {
        responseData = yield (0, processPoseAnterior_1.processPoseAnterior)(data, calibration, thresholds);
        if (isErrorFrame(responseData)) {
            addErrorFrame(socketData);
            return responseData;
        }
    }
    else {
        responseData = yield (0, processPoseLateral_1.processPoseLateral)(data, thresholds);
    }
    updateSocketDataFrames(socketData, responseData.error);
    return responseData;
});
exports.handleAnalyzePosture = handleAnalyzePosture;
const handleAnalyzeCamera = (data, socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    const postureView = socketDataMap.get(socket.id).postureView;
    const validationPoseResults = yield (0, landmarkValidation_1.validateReceivedLandmarks)(data);
    if (validationPoseResults.error)
        return validationPoseResults;
    return postureView === postureProcessing_1.PostureView.ANTERIOR ? (0, cameraValidation_1.validateCameraAnterior)(data) : (0, cameraValidation_1.validateCameraLateral)(data);
});
exports.handleAnalyzeCamera = handleAnalyzeCamera;
const isErrorFrame = (responseData) => {
    // Implement your logic for determining if a frame is an error frame
    return responseData.details.headTurned;
};
const addErrorFrame = (socketData) => {
    socketData.errorFrames += 1;
};
const updateSocketDataFrames = (socketData, isBad) => {
    if (isBad) {
        socketData.badFrames += 1;
    }
    else {
        socketData.goodFrames += 1;
    }
};
//# sourceMappingURL=processPose.js.map