import { messageFactory } from "../utilities/MessageFactory";
import { SocketData, ResponseData, ClientToServerEvents, ServerToClientEvents } from "../types/communicationSocket";
import { LandmarkDict, LandmarkDictSchema } from "../types/postureProcessing";
import { validateLandmarks } from "../validation/landmarkValidation";
import { Socket } from "socket.io";

export const handleCalibration = async (
  receivedData: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
): Promise<ResponseData> => {
  try {
    if (!receivedData) return messageFactory.getMessage("CALIBRATION_NOT_SET");
    await LandmarkDictSchema.validate({ landmarks: receivedData });

    const receivedCalibration = receivedData as LandmarkDict;
    if (!validateLandmarks(receivedCalibration)) {
      return messageFactory.getMessage("LANDMARKS_NOT_VISIBLE");
    }

    const socketData = socketDataMap.get(socket.id);
    if (socketData) {
      socketData.calibration = receivedCalibration;
      return messageFactory.getMessage("CALIBRATION_SET");
    }

    return messageFactory.getMessage("CALIBRATION_NOT_SET");
  } catch (err) {
    return messageFactory.getMessage("CALIBRATION_NOT_SET");
  }
};
