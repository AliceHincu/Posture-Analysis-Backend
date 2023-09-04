"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes, Model } = require("sequelize");
const database_1 = require("../../frameworks-and-drivers/config/database");
class PostureScore extends Model {
}
PostureScore.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    score: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
}, {
    sequelize: database_1.sequelize,
    modelName: "PostureScore",
});
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("All models were synchronized successfully.");
//   })
//   .catch((error: any) => {
//     console.log("Error syncing models:", error);
//   });
module.exports = PostureScore;
//# sourceMappingURL=PostureScore.js.map