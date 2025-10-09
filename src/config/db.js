import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      charset: process.env.CHAR_SET,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database connected successfully");

    await import("../models/index.js");

    if (process.env.NODE_ENV) {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully");
    }
  } catch (error) {
    console.error(" Unable to connect to database:", error);
    process.exit(1);
  }
};
