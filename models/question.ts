import Sequelize from "sequelize";
import { sequelize } from "./sequelize";

export class Question extends Sequelize.Model {}

Question.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: { type: Sequelize.DataTypes.STRING(2048), allowNull: false },
    answer: { type: Sequelize.DataTypes.STRING(2048), allowNull: false },
  },
  {
    sequelize,
    modelName: "question",
    timestamps: false,
  }
);
