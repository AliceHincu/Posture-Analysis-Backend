import express from "express";
import { createScore, getScoresByUserId, getScoresByUserIdAndDate } from "../actions/postureScoreActions";
import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, SocketData, ResponseData } from "../types/communicationSocket";
import { messageFactory } from "../utilities/MessageFactory";
import moment from "moment-timezone";
import { getUserBySessionToken } from "../actions/userActions";

// Create Score Controller
export const handleScore = async (
  receivedData: any,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
): Promise<ResponseData> => {
  try {
    const socketData = socketDataMap.get(socket.id);
    if (!socketData) {
      return messageFactory.getMessage("SCORE_NOT_SET");
    }

    console.log(socketData);
    const score = calculateScore(socketData.goodFrames, socketData.badFrames);
    const response = { error: false, message: score.toString() };
    const token = receivedData as string;
    if (!token) {
      resetFrames(socket, socketDataMap);
      return response;
    }

    const user = await getUserBySessionToken(token);
    const userId = user.dataValues.id;
    if (!userId) {
      return messageFactory.getMessage("SCORE_NOT_SET");
    }
    await createPostureScore(userId, socketData.startTime, new Date(), score);
    resetFrames(socket, socketDataMap);
    return response;
  } catch (err) {
    return messageFactory.getMessage("SCORE_NOT_SET");
  }
};

export const handleStart = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  const socketData = socketDataMap.get(socket.id);
  socketData.startTime = new Date();
};

export const createPostureScore = async (userId: number, startTime: Date, endTime: Date, score: number) => {
  try {
    const newScore = await createScore({
      userId,
      startTime,
      endTime,
      score,
    });

    return newScore;
  } catch (error) {
    throw error;
  }
};

export const calculateScore = (goodFrames: number, badFrames: number): number => {
  if (goodFrames + badFrames == 0) return 0;
  return (goodFrames / (goodFrames + badFrames)) * 100;
};

const mapScores = (scores: any[]) =>
  scores.map((score) => {
    const data = score.dataValues;
    return { id: data.id, startTime: data.startTime, endTime: data.endTime, score: data.score };
  });

export const getPostureScoresByToken = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.params;
    const user = await getUserBySessionToken(token);
    const userId = user.dataValues.id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const scores = await getScoresByUserId(userId);
    return res.json(mapScores(scores));
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while retrieving the posture scores.");
  }
};

export const getPostureScoresByTokenAndDate = async (req: express.Request, res: express.Response) => {
  try {
    const { token, date } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1);

    const user = await getUserBySessionToken(token);
    const userId = user.dataValues.id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const scores = await getScoresByUserIdAndDate(userId, parsedDate, nextDay);
    return res.json(mapScores(scores));
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while retrieving the posture scores.");
  }
};

const resetFrames = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  socketDataMap: Map<string, SocketData>
) => {
  const socketData = socketDataMap.get(socket.id);
  if (socketData) {
    socketData.goodFrames = 0;
    socketData.badFrames = 0;
    socketData.errorFrames = 0;
    socketData.startTime = null;
  }
};

const getDateRo = () => {
  const nowInEET = moment().tz("Europe/Bucharest");
  return new Date(nowInEET.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z");
};
