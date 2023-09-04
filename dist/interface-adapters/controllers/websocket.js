"use strict";
// socketController.ts
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
exports.setupSocketEvents = void 0;
const communicationSocket_1 = require("../../entities/types/communicationSocket");
const postureProcessing_1 = require("../../entities/types/postureProcessing");
const MessageFactory_1 = require("../../use-cases/utilities/MessageFactory");
const calibration_1 = require("./calibration");
const disconnect_1 = require("./disconnect");
const postureScores_1 = require("./postureScores");
const postureView_1 = require("./postureView");
const processPose_1 = require("./processPose");
const thresholds_1 = require("./thresholds");
const initializeSocketData = (socket, socketDataMap) => {
    socketDataMap.set(socket.id, {
        postureView: postureProcessing_1.PostureView.ANTERIOR,
        thresholds: postureProcessing_1.THRESHOLD_VALUES_ANTERIOR["Moderate"],
        strictness: "Moderate",
        goodFrames: 0,
        badFrames: 0,
        errorFrames: 0,
        startTime: null,
    });
};
const setupSocketEvents = (io, socketDataMap) => {
    io.on("connection", (socket) => {
        console.log("=== An user connected ===");
        initializeSocketData(socket, socketDataMap);
        socket.on(communicationSocket_1.ClientToServerEventNames.AnalyzePosture, (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const processedData = yield (0, processPose_1.handleAnalyzePosture)(data, socket, socketDataMap);
                socket.emit(communicationSocket_1.ServerToClientEventNames.PostureAnalyzed, processedData);
            }
            catch (error) {
                socket.emit(communicationSocket_1.ServerToClientEventNames.PostureAnalyzed, MessageFactory_1.messageFactory.getMessage("UNKNOWN_ERROR"));
            }
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.AnalyzeCamera, (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const processedData = yield (0, processPose_1.handleAnalyzeCamera)(data, socket, socketDataMap);
                socket.emit(communicationSocket_1.ServerToClientEventNames.CameraAnalyzed, processedData);
            }
            catch (error) {
                socket.emit(communicationSocket_1.ServerToClientEventNames.CameraAnalyzed, MessageFactory_1.messageFactory.getMessage("UNKNOWN_ERROR"));
            }
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.SetPostureView, (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield (0, postureView_1.handlePostureView)(data, socket, socketDataMap);
                socket.emit(communicationSocket_1.ServerToClientEventNames.PostureViewProcessed, response);
            }
            catch (error) {
                socket.emit(communicationSocket_1.ServerToClientEventNames.PostureViewProcessed, MessageFactory_1.messageFactory.getMessage("UNKNOWN_ERROR"));
            }
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.SetCalibration, (data) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, calibration_1.handleCalibration)(data, socket, socketDataMap);
            socket.emit(communicationSocket_1.ServerToClientEventNames.CalibrationProcessed, response);
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.SetThresholdStrictness, (data) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, thresholds_1.handleThresholds)(data, socket, socketDataMap);
            socket.emit(communicationSocket_1.ServerToClientEventNames.ThresholdsProcessed, response);
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.SetScore, (data) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, postureScores_1.handleScore)(data, socket, socketDataMap);
            socket.emit(communicationSocket_1.ServerToClientEventNames.ScoreProcessed, response);
        }));
        socket.on(communicationSocket_1.ClientToServerEventNames.setStarted, (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, postureScores_1.handleStart)(socket, socketDataMap);
        }));
        socket.on("disconnect", () => {
            (0, disconnect_1.handleSocketDisconnection)(socket, socketDataMap);
        });
    });
};
exports.setupSocketEvents = setupSocketEvents;
//# sourceMappingURL=websocket.js.map