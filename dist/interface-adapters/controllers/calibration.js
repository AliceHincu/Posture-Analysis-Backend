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
exports.handleCalibration = void 0;
const MessageFactory_1 = require("../../use-cases/utilities/MessageFactory");
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const landmarkValidation_1 = require("../../use-cases/validation/landmarkValidation");
const handleCalibration = (receivedData, socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!receivedData)
            return MessageFactory_1.messageFactory.getMessage("CALIBRATION_NOT_SET");
        yield postureProcessing_1.LandmarkDictSchema.validate({ landmarks: receivedData });
        const receivedCalibration = receivedData;
        if (!(0, landmarkValidation_1.validateLandmarks)(receivedCalibration)) {
            return MessageFactory_1.messageFactory.getMessage("LANDMARKS_NOT_VISIBLE");
        }
        const socketData = socketDataMap.get(socket.id);
        if (socketData) {
            socketData.calibration = receivedCalibration;
            return MessageFactory_1.messageFactory.getMessage("CALIBRATION_SET");
        }
        return MessageFactory_1.messageFactory.getMessage("CALIBRATION_NOT_SET");
    }
    catch (err) {
        return MessageFactory_1.messageFactory.getMessage("CALIBRATION_NOT_SET");
    }
});
exports.handleCalibration = handleCalibration;
//# sourceMappingURL=calibration.js.map