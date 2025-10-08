import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Actor = sequelize.define(
  "Actor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tier: {
      type: DataTypes.ENUM("Premium", "Standard", "Basic"),
      allowNull: false,
      defaultValue: "Standard",
    },
    eventTiming: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    languages: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    storyHeading: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    storySubheading: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    storyDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performanceMembers: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    performanceTiming: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    travelAvailability: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "actors",
    timestamps: true,
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["tier"] },
      { fields: ["city"] },
      { fields: ["languages"] },
      { fields: ["genre"] },
    ],
  }
);

export default Actor;
