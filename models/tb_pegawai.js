import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;

const Tb_pegawai = db_hc.define(
  "tb_pegawai",
  {
    NIP: {
      type: DataTypes.STRING(18),
      allowNull: false,
      primaryKey: true
    },
    NAMA: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    JABATAN: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    UNIT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    KD_UNIT: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    STATUS: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    NO_REG: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
  Sequelize,
  tableName: 'tb_pegawai',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "NIP" },
      ]
    },
  ]
});

export default Tb_pegawai