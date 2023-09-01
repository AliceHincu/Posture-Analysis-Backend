import express from "express";
import { getPostureScoresByToken, getPostureScoresByTokenAndDate } from "../controllers/postureScores";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/postureScores/:token", isAuthenticated, getPostureScoresByToken);
  router.get("/postureScores/:token/:date", isAuthenticated, getPostureScoresByTokenAndDate);
};
