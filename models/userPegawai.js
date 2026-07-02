import Tb_pegawai from "./tb_pegawai.js";
import Tb_user from "./tb_user.js";
import Tb_r_upt from "./tb_r_upt.js";

// Tb_pegawai.js
Tb_pegawai.hasOne(Tb_user, {
  foreignKey: "USERNAME",  // kolom di tb_user yang berelasi
  sourceKey: "NIP",        // kolom di tb_pegawai yang dicocokkan
  as: "userData",          // harus sama dengan `as` di include
});

// Tb_user.js
Tb_user.belongsTo(Tb_pegawai, {
  foreignKey: "USERNAME",
  targetKey: "NIP",
  as: "userData",
});

// Pegawai memiliki kd_upt > ke tb_upt
Tb_pegawai.belongsTo(Tb_r_upt, {
  foreignKey: 'KD_UNIT',
  targetKey: 'KD_UNIT',
  as: 'uptData' 
});

Tb_r_upt.hasMany(Tb_pegawai, {
  foreignKey: 'KD_UNIT',
  sourceKey: 'KD_UNIT',
  as: 'pegawai'
});
export default function setupUserPegawai() {
 }