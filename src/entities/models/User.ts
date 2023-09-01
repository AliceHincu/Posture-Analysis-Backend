const { DataTypes, Model } = require("sequelize");
import { sequelize } from "../../frameworks-and-drivers/config/database";

class User extends Model {}

User.init(
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING },
    sessionToken: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "User",
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

module.exports = User;
