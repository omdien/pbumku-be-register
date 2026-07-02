import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;


const Tb_trader_upt = db_hc.define(
  "tb_trader_upt",
  {
    KODE_TRADER: {
      autoIncrement: false,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    KD_UNIT: {
      autoIncrement: false,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    KODE_TRADER_LOKAL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    STATUS: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    TGL_AKTIF: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    USER_UPDATE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DATE_CREATED: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, 
  {
    Sequelize,
    tableName: 'tb_trader_upt',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KODE_TRADER" },
        ]
      },
    ]
  }
);

export default Tb_trader_upt;