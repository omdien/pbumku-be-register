import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";
import Users from "../models/tb_user.js";

const { DataTypes } = Sequelize;


const Tb_r_trader = db_hc.define(
  "tb_r_trader",
  {
    KODE_TRADER: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    JENIS_USAHA: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    NOMOR_KUSUKA: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    NAMA: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    NPWP: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    NO_IZIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ALAMAT: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    PROPINSI: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    KOTA: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    KODEPOS: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TELEPON: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    EMAIL_PNBP: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    KETERANGAN: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    TGL_DAFTAR: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FILE_ID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'asal saja'
    },
    STATUS: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    LAST_UPDATED: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    Sequelize,
    tableName: 'tb_r_trader',
    freezeTableName: true,
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
      {
        name: "IDX_NM_TRADER",
        using: "BTREE",
        fields: [
          { name: "NAMA" },
        ]
      },
      {
        name: "IDX_NPWP",
        using: "BTREE",
        fields: [
          { name: "NPWP" },
        ]
      },
      {
        name: "FILE_ID",
        using: "BTREE",
        fields: [
          { name: "FILE_ID" },
        ]
      },
      {
        name: "STATUS",
        using: "BTREE",
        fields: [
          { name: "STATUS" },
        ]
      },
    ]
  }
);

Tb_r_trader.hasMany(Users, {foreignKey: 'KODE_TRADER'});
Users.belongsTo(Tb_r_trader, {foreignKey: 'KODE_TRADER'});
// Users.hasMany(Products);
// Products.belongsTo(Users, {foreignKey: 'userId'});

export default Tb_r_trader;