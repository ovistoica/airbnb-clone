import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "./sequelize";

export class User extends Model {
  public password!: string;
  public email!: string;

  public isPasswordValid!: Function;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10;
        const password = user.password || user.getDataValue("password");
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(password, salt);
      },
    },
  }
);

User.prototype.isPasswordValid = async function (password: string) {
  return await bcrypt.compare(password, this.password!);
};
