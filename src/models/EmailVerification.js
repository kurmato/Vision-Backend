import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EmailVerification = sequelize.define("EmailVerification", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default EmailVerification;
