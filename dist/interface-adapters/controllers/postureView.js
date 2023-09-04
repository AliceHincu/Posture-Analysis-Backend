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
exports.handlePostureView = void 0;
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const MessageFactory_1 = require("../../use-cases/utilities/MessageFactory");
const handlePostureView = (receivedData, socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!receivedData)
            return MessageFactory_1.messageFactory.getMessage("POSTURE_NOT_SET");
        postureProcessing_1.PostureViewSchema.validateSync(receivedData);
        const socketData = socketDataMap.get(socket.id);
        if (socketData) {
            socketData.postureView = receivedData;
            socketData.thresholds =
                socketData.postureView === postureProcessing_1.PostureView.ANTERIOR
                    ? postureProcessing_1.THRESHOLD_VALUES_ANTERIOR[socketData.strictness]
                    : postureProcessing_1.THRESHOLD_VALUES_LATERAL[socketData.strictness];
            return MessageFactory_1.messageFactory.getMessage("POSTURE_SET");
        }
        return MessageFactory_1.messageFactory.getMessage("POSTURE_NOT_SET");
    }
    catch (err) {
        return MessageFactory_1.messageFactory.getMessage("POSTURE_NOT_SET");
    }
});
exports.handlePostureView = handlePostureView;
//# sourceMappingURL=postureView.js.map