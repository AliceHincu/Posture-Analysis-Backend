import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  ResponseData,
} from "../../entities/types/communicationSocket";
import { messageFactory } from "../../use-cases/utilities/MessageFactory";
import {
  PostureView,
  THRESHOLD_VALUES_ANTERIOR,
  THRESHOLD_VALUES_LATERAL,
  ThresholdStrictness,
  ThresholdStrictnessSchema,
} from "../../entities/types/postureProcessing";

export const handleThresholds = async (
  receivedData: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
): Promise<ResponseData> => {
  try {
    if (!receivedData) return messageFactory.getMessage("THRESHOLDS_NOT_SET");
    ThresholdStrictnessSchema.validateSync(receivedData);

    const socketData = socketDataMap.get(socket.id);
    if (!socketData) {
      return messageFactory.getMessage("THRESHOLDS_NOT_SET");
    }

    const strictness = receivedData as ThresholdStrictness;
    socketData.strictness = strictness;

    socketData.thresholds =
      socketData.postureView === PostureView.ANTERIOR
        ? THRESHOLD_VALUES_ANTERIOR[strictness]
        : THRESHOLD_VALUES_LATERAL[strictness];

    return messageFactory.getMessage("THRESHOLDS_SET");
  } catch (err) {
    return messageFactory.getMessage("THRESHOLDS_NOT_SET");
  }
};
