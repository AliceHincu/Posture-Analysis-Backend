import { Socket } from "socket.io";
import { ClientToServerEvents, ResponseData, ServerToClientEvents, SocketData } from "../types/communicationSocket";
import {
  PostureView,
  PostureViewSchema,
  THRESHOLD_VALUES_ANTERIOR,
  THRESHOLD_VALUES_LATERAL,
} from "../types/postureProcessing";
import { messageFactory } from "../utilities/MessageFactory";

export const handlePostureView = async (
  receivedData: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
): Promise<ResponseData> => {
  try {
    if (!receivedData) return messageFactory.getMessage("POSTURE_NOT_SET");
    PostureViewSchema.validateSync(receivedData);

    const socketData = socketDataMap.get(socket.id);

    if (socketData) {
      socketData.postureView = receivedData as PostureView;

      socketData.thresholds =
        socketData.postureView === PostureView.ANTERIOR
          ? THRESHOLD_VALUES_ANTERIOR[socketData.strictness]
          : THRESHOLD_VALUES_LATERAL[socketData.strictness];
      return messageFactory.getMessage("POSTURE_SET");
    }
    return messageFactory.getMessage("POSTURE_NOT_SET");
  } catch (err) {
    return messageFactory.getMessage("POSTURE_NOT_SET");
  }
};
