"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageFactory = void 0;
// singleton factory
class MessageFactory {
    constructor() {
        this.messages = {
            HEAD_STRAIGHT: { error: true, message: "Stand with your head straight! " },
            SHOULDERS_STRAIGHT: { error: true, message: "Stand with your shoulders straight! " },
            BOTH_STRAIGHT: { error: true, message: "Stand with your shoulders and head straight! " },
            POSITION_PROPER: { error: false, message: "Position is proper! " },
            POSITION_NOT_PROPER: { error: false, message: "Position is NOT proper! " },
            HEAD_TURNED: { error: false, message: "Head is turned, it will not be taken into account in scoring! " },
            ELBOWS_FAR: { error: false, message: "Your elbows should be at your sides. " },
            CLOSE_TO_SCREEN: { error: false, message: "You are too close to the screen. " },
            LEANING_LEFT: { error: true, message: "You are leaning to the left. " },
            LEANING_RIGHT: { error: true, message: "You are leaning to the right. " },
            LEANING_ON_ELBOW: { error: true, message: "You are leaning on your elbows (shoulder position incorrect). " },
            POSTURE_NOT_SET: { error: true, message: "Posture view wasn't set. " },
            POSTURE_SET: { error: false, message: "Posture view was set. " },
            CALIBRATION_NOT_SET: { error: true, message: "Calibrations weren't set. " },
            CALIBRATION_SET: { error: false, message: "Calibrations were set. " },
            THRESHOLDS_NOT_SET: { error: true, message: "Thresholds weren't set. " },
            THRESHOLDS_SET: { error: false, message: "Thresholds were set. " },
            SCORE_NOT_SET: { error: true, message: "Score was NOT set. " },
            SCORE_SET: { error: false, message: "Score was set. " },
            UNKNOWN_ERROR: { error: true, message: "There is a problem with the server- unknown error. " },
            FACING_CAMERA: { error: false, message: "You are facing the camera! " },
            NOT_FACING_CAMERA: { error: true, message: "You are NOT facing the camera! " },
            "90_DEGREE_FROM_CAMERA": {
                error: false,
                message: "Your position is correctly at a 90-degree angle to the camera.",
            },
            NOT_90_DEGREE_FROM_CAMERA: { error: true, message: "Your position is NOT at a 90-degree angle to the camera." },
            LANDMARKS_VISIBLE: { error: false, message: "Landmarks visible. " },
            LANDMARKS_NOT_VISIBLE: { error: true, message: "Part of your body is out of frame. Please adjust your position. " },
        };
    }
    getMessage(key) {
        return this.messages[key];
    }
}
// Singleton instance
exports.messageFactory = new MessageFactory();
//# sourceMappingURL=MessageFactory.js.map