import { Sequelize } from "sequelize";
import db_hc from "../config/Database.js";
import Tb_kota from "./tb_kota.js";

const { DataTypes } = Sequelize;


const Tb_propinsi = db_hc.define(
  "tb_propinsi", 
  {
    KODE_PROPINSI: {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey: true
    },
    URAIAN_PROPINSI: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, 
  {
    Sequelize,
    tableName: 'tb_propinsi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KODE_PROPINSI" },
        ]
      },
      {
        name: "NM_PROPINSI",
        using: "BTREE",
        fields: [
          { name: "URAIAN_PROPINSI" },
        ]
      },
    ]
  }
);

Tb_kota.hasOne(Tb_propinsi, { foreignKey: 'KODE_PROPINSI' });
Tb_propinsi.hasMany(Tb_kota, { foreignKey: 'KODE_PROPINSI' });

export default Tb_propinsi;