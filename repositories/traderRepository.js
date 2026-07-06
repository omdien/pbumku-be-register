import Tb_r_trader from "../models/Tb_r_trader.js";
import Tb_user from "../models/tb_user.js";

export const findAllTraders = async (kd_upt) => {
    // Definisikan kondisi filter
    const userFilter = { ROLE: 4 };

    // Jika kd_upt ada, tambahkan ke filter
    if (kd_upt) {
        userFilter.KD_UNIT = kd_upt;
    }

    // Eksekusi query
    return await Tb_r_trader.findAll({
        attributes: ["KODE_TRADER", "NAMA", "NPWP", "EMAIL", "TELEPON"],
        include: {
            model: Tb_user,
            attributes: ["KD_UNIT"],
            where: userFilter,
        },
        distinct: true,
    });
};

export const findNewTraders = async (kd_upt) => {
    // Definisikan filter dasar
    const userWhere = { ROLE: '4' };

    // Jika ada kd_upt, tambahkan ke filter user
    if (kd_upt) {
        userWhere.KD_UNIT = kd_upt;
    }

    // Menggunakan pola yang sama persis dengan controller lama yang berhasil
    return await Tb_r_trader.findAll({
        attributes: ["KODE_TRADER", "NAMA", "NPWP", "EMAIL", "TELEPON"],
        include: {
            model: Tb_user,
            attributes: ["NAMA"], // Sesuaikan dengan controller lama
            where: userWhere,     // Filter dinamis di sini
        },
    });
};

export const findAllTradersWithUsers = async () => {
    console.log("--- 3c. Masuk ke Repository, mengeksekusi Query ---");
    
    // Gunakan logging eksplisit di sini
    const result = await Tb_r_trader.findAll({
        attributes: ["KODE_TRADER", "NAMA", "NPWP", "EMAIL", "TELEPON"],
        include: {
            model: Tb_user,
            attributes: ["NAMA", "KD_UNIT"],
            where: { ROLE: '4' },
        },
        logging: (msg) => console.log("SQL LOG:", msg) // Memaksa log muncul
    });
    
    console.log("--- 3d. Query Selesai ---");
    return result;
};