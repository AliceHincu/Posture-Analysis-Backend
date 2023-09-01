type MessageKey =
  | "HEAD_STRAIGHT"
  | "SHOULDERS_STRAIGHT"
  | "BOTH_STRAIGHT"
  | "POSITION_PROPER"
  | "POSITION_NOT_PROPER"
  | "HEAD_TURNED"
  | "ELBOWS_FAR"
  | "CLOSE_TO_SCREEN"
  | "LEANING_ON_ELBOW"
  | "LEANING_LEFT"
  | "LEANING_RIGHT"
  | "POSTURE_NOT_SET"
  | "POSTURE_SET"
  | "CALIBRATION_NOT_SET"
  | "CALIBRATION_SET"
  | "THRESHOLDS_NOT_SET"
  | "THRESHOLDS_SET"
  | "SCORE_SET"
  | "SCORE_NOT_SET"
  | "UNKNOWN_ERROR";

type MessageKeyCameraValidation =
  | "FACING_CAMERA"
  | "NOT_FACING_CAMERA"
  | "90_DEGREE_FROM_CAMERA"
  | "NOT_90_DEGREE_FROM_CAMERA";
type MessageKeyLandmarksValidation = "LANDMARKS_VISIBLE" | "LANDMARKS_NOT_VISIBLE";

type MessageK = MessageKey | MessageKeyCameraValidation | MessageKeyLandmarksValidation;

interface ErrorMessage {
  error: boolean;
  message: string;
}

// singleton factory
class MessageFactory {
  private messages: Record<MessageK, ErrorMessage> = {
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

  getMessage(key: MessageK): ErrorMessage {
    return this.messages[key];
  }
}

// Singleton instance
export const messageFactory = new MessageFactory();
