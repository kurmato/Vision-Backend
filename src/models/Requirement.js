import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Requirement = sequelize.define(
  "Requirement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "events",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
    occasions: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    additionalInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "requirements",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["email"] },
      { fields: ["eventDate"] },
      { fields: ["city"] },
    ],
  }
);

export default Requirement;
