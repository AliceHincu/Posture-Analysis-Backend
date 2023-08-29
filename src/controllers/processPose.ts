import { Socket } from "socket.io";
import { validateReceivedLandmarks } from "../validation/landmarkValidation";
import { PostureView, ThresholdsAnterior, ThresholdsLateral } from "../types/postureProcessing";
import {
  ClientToServerEvents,
  ErrorDetails,
  ErrorDetailsAnterior,
  ResponseData,
  ServerToClientEvents,
  SocketData,
} from "../types/communicationSocket";
import { processPoseAnterior } from "../services/processPoseAnterior";
import { processPoseLateral } from "../services/processPoseLateral";
import { validateCameraAnterior, validateCameraLateral } from "../validation/cameraValidation";

/**
 * Analyzes the posture of the client
 * @param data data received from client
 * @param socket socket of the client
 * @param socketDataMap map that holds extra properties for each socket like the posture view chosen by the client
 * @returns {ResponseData} emits back to the client the response
 */
export const handleAnalyzePosture = async (
  data: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  const socketData = socketDataMap.get(socket.id);

  const validationPoseResults = await validateReceivedLandmarks(data);
  if (validationPoseResults.error) {
    addErrorFrame(socketData);
    return validationPoseResults;
  } // error frame

  let responseData;
  const { postureView, calibration, thresholds } = socketData;

  if (postureView === PostureView.ANTERIOR) {
    responseData = await processPoseAnterior(data, calibration, thresholds as ThresholdsAnterior);
    if (isErrorFrame(responseData)) {
      addErrorFrame(socketData);
      return responseData;
    }
  } else {
    responseData = await processPoseLateral(data, thresholds as ThresholdsLateral);
  }

  updateSocketDataFrames(socketData, responseData.error);
  return responseData;
};

export const handleAnalyzeCamera = async (
  data: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  const postureView = socketDataMap.get(socket.id).postureView;
  const validationPoseResults = await validateReceivedLandmarks(data);
  if (validationPoseResults.error) return validationPoseResults;

  return postureView === PostureView.ANTERIOR ? validateCameraAnterior(data) : validateCameraLateral(data);
};

const isErrorFrame = (responseData: ResponseData): boolean => {
  // Implement your logic for determining if a frame is an error frame
  return (responseData.details as ErrorDetailsAnterior).headTurned;
};

const addErrorFrame = (socketData: SocketData) => {
  socketData.errorFrames += 1;
};

const updateSocketDataFrames = (socketData: SocketData, isBad: boolean) => {
  if (isBad) {
    socketData.badFrames += 1;
  } else {
    socketData.goodFrames += 1;
  }
};
