const { DataTypes, Model } = require("sequelize");
import { sequelize } from "../../frameworks-and-drivers/config/database";

class PostureScore extends Model {}

PostureScore.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // name of the table, not the model
        key: "id",
      },
    },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    score: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
  },
  {
    sequelize,
    modelName: "PostureScore",
  }
);

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("All models were synchronized successfully.");
//   })
//   .catch((error: any) => {
//     console.log("Error syncing models:", error);
//   });

module.exports = PostureScore;
