import { user, password, host, database } from "../database";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "postgres",
  logging: false,
});
