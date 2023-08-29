require("dotenv").config();

const result = require("dotenv").config();

if (result.error) {
  throw result.error;
}
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { Server, Socket } from "socket.io";

import router from "./router";
import { handleAnalyzeCamera, handleAnalyzePosture } from "./controllers/processPose";
import {
  ClientToServerEventNames,
  ClientToServerEvents,
  ServerToClientEventNames,
  ServerToClientEvents,
  SocketData,
} from "./types/communicationSocket";
import { PostureView, THRESHOLD_VALUES_ANTERIOR, THRESHOLD_VALUES_LATERAL } from "./types/postureProcessing";
import { handlePostureView } from "./controllers/postureView";
import { handleCalibration } from "./controllers/calibration";
import { messageFactory } from "./utilities/MessageFactory";
import { handleSocketDisconnection } from "./controllers/disconnect";
import { handleThresholds } from "./controllers/thresholds";
import { handleStart, handleScore, calculateScore, createPostureScore } from "./controllers/postureScores";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // replace with the URL of your frontend
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const socketDataMap = new Map<string, SocketData>();
const initializeSocketData = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
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

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log("=== An user connected ===");

  initializeSocketData(socket);

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

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
app.use("/", router());
