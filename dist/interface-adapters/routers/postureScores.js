"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postureScores_1 = require("../controllers/postureScores");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get("/postureScores/:token", middlewares_1.isAuthenticated, postureScores_1.getPostureScoresByToken);
    router.get("/postureScores/:token/:date", middlewares_1.isAuthenticated, postureScores_1.getPostureScoresByTokenAndDate);
};
//# sourceMappingURL=postureScores.js.map