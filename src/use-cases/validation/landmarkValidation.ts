import { LandmarkDict, LandmarkDictSchema, POSE_LANDMARKS } from "../../entities/types/postureProcessing";
import { ResponseData } from "../../entities/types/communicationSocket";
import { messageFactory } from "../utilities/MessageFactory";

export const validateLandmarks = (data: LandmarkDict): ResponseData => {
  if (doLandmarksExist(data)) {
    return messageFactory.getMessage("LANDMARKS_VISIBLE");
  } else {
    return messageFactory.getMessage("LANDMARKS_NOT_VISIBLE");
  }
};

export const validateReceivedLandmarks = async (receivedLandmarks: any): Promise<ResponseData> => {
  try {
    await LandmarkDictSchema.validate({ landmarks: receivedLandmarks });
    const validationResults: ResponseData = validateLandmarks(receivedLandmarks);
    if (validationResults.error) return validationResults;
    return messageFactory.getMessage("LANDMARKS_VISIBLE");
  } catch (err) {
    return { error: true, message: "Something went wrong." };
  }
};

const VISIBILITY_THRESHOLD = 0.75;

/**
 * Check the visibility of the landmarks.
 * If they are not visible, then the posture processing should stop.
 * @param {LandmarkDict} landmarks - landmarks returned by mediapipe pose
 * @returns - true if every landmark is visible, false otherwise
 */
export const doLandmarksExist = (landmarks: LandmarkDict): boolean => {
  return !Object.entries(landmarks).some(([key, landmark]) => {
    // Exclude elbows from the visibility check
    if (key == POSE_LANDMARKS.LEFT_ELBOW.toString() || key == POSE_LANDMARKS.RIGHT_ELBOW.toString()) {
      return false;
    }

    return landmark.visibility < VISIBILITY_THRESHOLD;
  });
};
