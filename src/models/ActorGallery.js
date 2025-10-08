import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ActorGallery = sequelize.define(
  "ActorGallery",
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
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "actor_gallery",
    timestamps: true,
    indexes: [{ fields: ["actorId"] }, { fields: ["imageId"] }],
  }
);

export default ActorGallery;
