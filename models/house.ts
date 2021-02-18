import Sequelize, { Model } from "sequelize";
import { sequelize } from "./sequelize";

export class House extends Model {}

House.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    host: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    picture: { type: Sequelize.DataTypes.STRING, allowNull: false },
    type: { type: Sequelize.DataTypes.STRING, allowNull: false },
    town: { type: Sequelize.DataTypes.STRING, allowNull: false },
    title: { type: Sequelize.DataTypes.STRING, allowNull: false },
    price: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    superhost: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    description: { type: Sequelize.DataTypes.TEXT, allowNull: false },
    guests: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    bedrooms: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    beds: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    baths: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    wifi: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false },
    kitchen: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false },
    heating: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false },
    freeParking: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false },
    entirePlace: { type: Sequelize.DataTypes.BOOLEAN, allowNull: false },
  },
  { sequelize, modelName: "house", timestamps: false }
);
