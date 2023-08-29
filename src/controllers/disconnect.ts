import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "../types/communicationSocket";

export const handleSocketDisconnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  socketDataMap.delete(socket.id);
};
