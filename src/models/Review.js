import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ActorReview = sequelize.define(
  "ActorReview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "actors",
        key: "id",
      },
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "actor_reviews",
    timestamps: true,
    indexes: [{ fields: ["actorId"] }, { fields: ["rating"] }],
  }
);

export default ActorReview;
