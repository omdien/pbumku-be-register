import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;

const tb_log_reset_password = db_hc.define("tb_log_reset_password", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  requestedAt: {
    type: DataTypes.DATE,
    field: "REQUESTED_AT",
    defaultValue: DataTypes.NOW,
  },
  expiredAt: {
    type: DataTypes.DATE,
    field: "EXPIRED_AT",
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "pending",
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: "IP_ADDRESS",
  },
}, {
  tableName: "tb_log_reset_password", 
  freezeTableName: true,               
  timestamps: false                    
});

export default tb_log_reset_password;
