import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
//   host: process.env.DB_HOST!,
//   dialect: "postgres",
// });

// export const sequelize = new Sequelize(
//   process.env.POSTGRES_DATABASE!,
//   process.env.POSTGRES_USER!,
//   process.env.POSTGRES_PASSWORD!,
//   {
//     host: process.env.POSTGRES_HOST!,
//     dialect: "postgres",
//   }
// );

export const sequelize = new Sequelize(process.env.POSTGRES_URL!, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED PROMISE REJECTION
    },
  },
});
