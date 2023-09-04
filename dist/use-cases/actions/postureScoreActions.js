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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScore = exports.getScoresByUserIdAndDate = exports.getScoresByUserId = void 0;
const sequelize_1 = require("sequelize");
const PostureScore = require("../../entities/models/PostureScore");
// PostureScore Actions
const getScoresByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PostureScore.findAll({ where: { userId } });
});
exports.getScoresByUserId = getScoresByUserId;
const getScoresByUserIdAndDate = (userId, parsedDate, nextDay) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PostureScore.findAll({
        where: {
            userId,
            [sequelize_1.Op.or]: [
                {
                    startTime: {
                        [sequelize_1.Op.gte]: parsedDate,
                    },
                    endTime: {
                        [sequelize_1.Op.lt]: nextDay,
                    },
                },
                {
                    startTime: {
                        [sequelize_1.Op.lt]: nextDay,
                    },
                    endTime: {
                        [sequelize_1.Op.gte]: nextDay,
                    },
                },
            ],
        },
    });
});
exports.getScoresByUserIdAndDate = getScoresByUserIdAndDate;
const createScore = (values) => __awaiter(void 0, void 0, void 0, function* () {
    const score = yield PostureScore.create(values);
    return score;
});
exports.createScore = createScore;
//# sourceMappingURL=postureScoreActions.js.map