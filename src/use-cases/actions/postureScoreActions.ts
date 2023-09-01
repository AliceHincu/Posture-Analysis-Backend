import { Op } from "sequelize";

const PostureScore = require("../../entities/models/PostureScore");

// PostureScore Actions
export const getScoresByUserId = async (userId: string) => {
  return await PostureScore.findAll({ where: { userId } });
};

export const getScoresByUserIdAndDate = async (userId: string, parsedDate: Date, nextDay: Date) => {
  return await PostureScore.findAll({
    where: {
      userId,
      [Op.or]: [
        {
          startTime: {
            [Op.gte]: parsedDate,
          },
          endTime: {
            [Op.lt]: nextDay,
          },
        },
        {
          startTime: {
            [Op.lt]: nextDay,
          },
          endTime: {
            [Op.gte]: nextDay,
          },
        },
      ],
    },
  });
};

export const createScore = async (values: Record<string, any>) => {
  console.log(values);
  const score = await PostureScore.create(values);
  return score;
};
