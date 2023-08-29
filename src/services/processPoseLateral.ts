import { LateralPostureErrorMessageBuilder } from "../utilities/PostureErrorMessageBuilder";
import { ResponseData } from "../types/communicationSocket";
import { LandmarkDict, POSE_LANDMARKS, ThresholdsLateral } from "../types/postureProcessing";
import { messageFactory } from "../utilities/MessageFactory";
import { findAngle2 } from "./math";

export const processPoseLateral = async (
  receivedData: LandmarkDict,
  thresholds: ThresholdsLateral
): Promise<ResponseData> => {
  const landmarks = receivedData;

  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftEar = landmarks[POSE_LANDMARKS.LEFT_EAR];
  const rightEar = landmarks[POSE_LANDMARKS.RIGHT_EAR];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

  // calculate angles.
  const neckInclination = findAngle2(leftShoulder.x, leftShoulder.y, leftEar.x, leftEar.y);
  const torsoInclination = findAngle2(leftHip.x, leftHip.y, leftShoulder.x, leftShoulder.y);

  const isHeadHunched = neckInclination > thresholds.NECK_INCLINATION_THRESHOLD;
  const areShouldersHunched = torsoInclination > thresholds.TORSO_INCLINATION_THRESHOLD;

  const errorMessageBuilder = LateralPostureErrorMessageBuilder.getInstance().reset();
  errorMessageBuilder.addHeadStraightMessage(isHeadHunched).addShouldersStraightMessage(areShouldersHunched);

  const errorMessage = errorMessageBuilder.build();
  return { error: errorMessage.message ? true : false, message: errorMessage.message, details: errorMessage.details };
};
