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

import router from "./interface-adapters/routers";
import {
  ClientToServerEventNames,
  ClientToServerEvents,
  ServerToClientEventNames,
  ServerToClientEvents,
  SocketData,
} from "./entities/types/communicationSocket";
import { setupSocketEvents } from "./interface-adapters/controllers/websocket";

const app = express();

app.use(
  cors({
    origin: ["postureflawless.com", "localhost:3000"],
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["postureflawless.com", "localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const socketDataMap = new Map<string, SocketData>();

setupSocketEvents(io, socketDataMap);

server.listen(process.env.PORT!, () => {
  console.log("Server running ");
});
app.use("/", router());
