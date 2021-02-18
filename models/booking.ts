import Sequelize from "sequelize";
import { sequelize } from "./sequelize";

export class Booking extends Sequelize.Model {}

Booking.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    houseId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    sessionId: { type: Sequelize.DataTypes.STRING }, //store the user session after payment confirmation
    paid: { type: Sequelize.DataTypes.BOOLEAN },
  },
  {
    sequelize,
    modelName: "booking",
    timestamps: true,
  }
);
