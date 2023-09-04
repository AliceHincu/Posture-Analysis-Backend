"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerToClientEventNames = exports.ClientToServerEventNames = void 0;
var ClientToServerEventNames;
(function (ClientToServerEventNames) {
    ClientToServerEventNames["AnalyzePosture"] = "analyzePosture";
    ClientToServerEventNames["AnalyzeCamera"] = "analyzeCamera";
    ClientToServerEventNames["SetPostureView"] = "setPostureView";
    ClientToServerEventNames["SetCalibration"] = "setCalibration";
    ClientToServerEventNames["SetThresholdStrictness"] = "setThresholdStrictness";
    ClientToServerEventNames["SetScore"] = "setScore";
    ClientToServerEventNames["setStarted"] = "setStarted";
})(ClientToServerEventNames || (exports.ClientToServerEventNames = ClientToServerEventNames = {}));
var ServerToClientEventNames;
(function (ServerToClientEventNames) {
    ServerToClientEventNames["PostureAnalyzed"] = "poseDataProcessed";
    ServerToClientEventNames["CameraAnalyzed"] = "cameraProcessed";
    ServerToClientEventNames["PostureViewProcessed"] = "postureViewProcessed";
    ServerToClientEventNames["CalibrationProcessed"] = "calibrationProcessed";
    ServerToClientEventNames["ThresholdsProcessed"] = "thresholdsProcessed";
    ServerToClientEventNames["ScoreProcessed"] = "scoreProcessed";
})(ServerToClientEventNames || (exports.ServerToClientEventNames = ServerToClientEventNames = {}));
//# sourceMappingURL=communicationSocket.js.map