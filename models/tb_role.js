import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Tb_role = db.define("tb_role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_user: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "tb_role",
  timestamps: false  
});

export default Tb_role;