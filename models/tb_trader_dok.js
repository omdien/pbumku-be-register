import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;


const Tb_trader_dok = db_hc.define(
  "tb_trader_DOK",
  {
    FILE_ID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    DOK_KODE: {
      autoIncrement: false,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DOK_PATH: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, 
  {
    Sequelize,
    tableName: 'tb_trader_dok',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FILE_ID" }, 
          { name: "DOK_KODE" },
        ]
      },
    ]
  }
);

export default Tb_trader_dok;