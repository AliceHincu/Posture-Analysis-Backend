"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostureScoresByTokenAndDate = exports.getPostureScoresByToken = exports.calculateScore = exports.createPostureScore = exports.handleStart = exports.handleScore = void 0;
const postureScoreActions_1 = require("../../use-cases/actions/postureScoreActions");
const MessageFactory_1 = require("../../use-cases/utilities/MessageFactory");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const userActions_1 = require("../../use-cases/actions/userActions");
// Create Score Controller
const handleScore = (receivedData, socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const socketData = socketDataMap.get(socket.id);
        if (!socketData) {
            return MessageFactory_1.messageFactory.getMessage("SCORE_NOT_SET");
        }
        const score = (0, exports.calculateScore)(socketData.goodFrames, socketData.badFrames);
        const response = { error: false, message: score.toString() };
        const token = receivedData;
        if (!token) {
            resetFrames(socket, socketDataMap);
            return response;
        }
        const user = yield (0, userActions_1.getUserBySessionToken)(token);
        const userId = user.dataValues.id;
        if (!userId) {
            return MessageFactory_1.messageFactory.getMessage("SCORE_NOT_SET");
        }
        yield (0, exports.createPostureScore)(userId, socketData.startTime, new Date(), score);
        resetFrames(socket, socketDataMap);
        return response;
    }
    catch (err) {
        return MessageFactory_1.messageFactory.getMessage("SCORE_NOT_SET");
    }
});
exports.handleScore = handleScore;
const handleStart = (socket, socketDataMap) => __awaiter(void 0, void 0, void 0, function* () {
    const socketData = socketDataMap.get(socket.id);
    socketData.startTime = new Date();
});
exports.handleStart = handleStart;
const createPostureScore = (userId, startTime, endTime, score) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newScore = yield (0, postureScoreActions_1.createScore)({
            userId,
            startTime,
            endTime,
            score,
        });
        return newScore;
    }
    catch (error) {
        throw error;
    }
});
exports.createPostureScore = createPostureScore;
const calculateScore = (goodFrames, badFrames) => {
    if (goodFrames + badFrames == 0)
        return 0;
    return (goodFrames / (goodFrames + badFrames)) * 100;
};
exports.calculateScore = calculateScore;
const mapScores = (scores) => scores.map((score) => {
    const data = score.dataValues;
    return { id: data.id, startTime: data.startTime, endTime: data.endTime, score: data.score };
});
const getPostureScoresByToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const user = yield (0, userActions_1.getUserBySessionToken)(token);
        const userId = user.dataValues.id;
        if (!userId) {
            return res.status(400).json({ error: "Invalid token" });
        }
        const scores = yield (0, postureScoreActions_1.getScoresByUserId)(userId);
        return res.json(mapScores(scores));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while retrieving the posture scores.");
    }
});
exports.getPostureScoresByToken = getPostureScoresByToken;
const getPostureScoresByTokenAndDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, date } = req.params;
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }
        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1);
        const user = yield (0, userActions_1.getUserBySessionToken)(token);
        const userId = user.dataValues.id;
        if (!userId) {
            return res.status(400).json({ error: "Invalid token" });
        }
        const scores = yield (0, postureScoreActions_1.getScoresByUserIdAndDate)(userId, parsedDate, nextDay);
        return res.json(mapScores(scores));
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while retrieving the posture scores.");
    }
});
exports.getPostureScoresByTokenAndDate = getPostureScoresByTokenAndDate;
const resetFrames = (socket, socketDataMap) => {
    const socketData = socketDataMap.get(socket.id);
    if (socketData) {
        socketData.goodFrames = 0;
        socketData.badFrames = 0;
        socketData.errorFrames = 0;
        socketData.startTime = null;
    }
};
const getDateRo = () => {
    const nowInEET = (0, moment_timezone_1.default)().tz("Europe/Bucharest");
    return new Date(nowInEET.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z");
};
//# sourceMappingURL=postureScores.js.map