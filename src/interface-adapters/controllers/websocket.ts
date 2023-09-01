// socketController.ts

import { Socket, Server } from "socket.io";
import {
  SocketData,
  ClientToServerEvents,
  ServerToClientEvents,
  ClientToServerEventNames,
  ServerToClientEventNames,
} from "../../entities/types/communicationSocket";
import { PostureView, THRESHOLD_VALUES_ANTERIOR } from "../../entities/types/postureProcessing";
import { messageFactory } from "../../use-cases/utilities/MessageFactory";
import { handleCalibration } from "./calibration";
import { handleSocketDisconnection } from "./disconnect";
import { handleScore, handleStart } from "./postureScores";
import { handlePostureView } from "./postureView";
import { handleAnalyzePosture, handleAnalyzeCamera } from "./processPose";
import { handleThresholds } from "./thresholds";

const initializeSocketData = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  socketDataMap.set(socket.id, {
    postureView: PostureView.ANTERIOR,
    thresholds: THRESHOLD_VALUES_ANTERIOR["Moderate"],
    strictness: "Moderate",
    goodFrames: 0,
    badFrames: 0,
    errorFrames: 0,
    startTime: null,
  });
};

export const setupSocketEvents = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("=== An user connected ===");

    initializeSocketData(socket, socketDataMap);

    socket.on(ClientToServerEventNames.AnalyzePosture, async (data) => {
      try {
        const processedData = await handleAnalyzePosture(data, socket, socketDataMap);
        socket.emit(ServerToClientEventNames.PostureAnalyzed, processedData);
      } catch (error) {
        socket.emit(ServerToClientEventNames.PostureAnalyzed, messageFactory.getMessage("UNKNOWN_ERROR"));
      }
    });

    socket.on(ClientToServerEventNames.AnalyzeCamera, async (data) => {
      try {
        const processedData = await handleAnalyzeCamera(data, socket, socketDataMap);
        socket.emit(ServerToClientEventNames.CameraAnalyzed, processedData);
      } catch (error) {
        socket.emit(ServerToClientEventNames.CameraAnalyzed, messageFactory.getMessage("UNKNOWN_ERROR"));
      }
    });

    socket.on(ClientToServerEventNames.SetPostureView, async (data) => {
      try {
        const response = await handlePostureView(data, socket, socketDataMap);
        socket.emit(ServerToClientEventNames.PostureViewProcessed, response);
      } catch (error) {
        socket.emit(ServerToClientEventNames.PostureViewProcessed, messageFactory.getMessage("UNKNOWN_ERROR"));
      }
    });

    socket.on(ClientToServerEventNames.SetCalibration, async (data) => {
      const response = await handleCalibration(data, socket, socketDataMap);
      socket.emit(ServerToClientEventNames.CalibrationProcessed, response);
    });

    socket.on(ClientToServerEventNames.SetThresholdStrictness, async (data) => {
      const response = await handleThresholds(data, socket, socketDataMap);
      socket.emit(ServerToClientEventNames.ThresholdsProcessed, response);
    });

    socket.on(ClientToServerEventNames.SetScore, async (data) => {
      const response = await handleScore(data, socket, socketDataMap);
      socket.emit(ServerToClientEventNames.ScoreProcessed, response);
    });

    socket.on(ClientToServerEventNames.setStarted, async (data) => {
      await handleStart(socket, socketDataMap);
    });

    socket.on("disconnect", () => {
      handleSocketDisconnection(socket, socketDataMap);
    });
  });
};
