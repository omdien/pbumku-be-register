import {Sequelize, DataTypes} from "sequelize";

const User = Sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  resetToken: DataTypes.STRING,
  resetTokenExpire: DataTypes.DATE,
});

module.exports = User;