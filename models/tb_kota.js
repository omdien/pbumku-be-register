import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";

const { DataTypes } = Sequelize;


const Tb_kota = db_hc.define(
  "tb_kota",
  {
    KODE_KOTA: {
      type: DataTypes.STRING(4),
      allowNull: false,
      primaryKey: true
    },
    KODE_PROPINSI: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    URAIAN_KOTA: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, 
  {
    Sequelize,
    tableName: 'tb_kota',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KODE_KOTA" },
        ]
      },
      {
        name: "NM_KOTA",
        using: "BTREE",
        fields: [
          { name: "URAIAN_KOTA" },
        ]
      },
    ]
  }
);

export default Tb_kota;
