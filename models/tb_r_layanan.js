import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;


const Tb_r_layanan = db_hc.define(
  "tb_r_layanan",
  {
    KODE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    KODE_TRADER: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    KODE_LAYANAN: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    STS_VERIFIKASI: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
  }, 
  {
    Sequelize,
    tableName: 'tb_r_layanan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KODE" },
        ]
      },
    ]
  }
);

export default Tb_r_layanan;
