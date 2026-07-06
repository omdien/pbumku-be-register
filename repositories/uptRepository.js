import UPT from "../models/tb_r_upt.js"; // sesuaikan nama model Sequelize Anda untuk tb_r_upt

export const getUptByKode = async (kdUnit) => {
    return UPT.findOne({
        where: { KD_UNIT: kdUnit },
        attributes: [
            "KD_UNIT",
            "NM_UNIT_BARU",
            "NM_PENDEK_BARU",
            "ALAMAT_UNIT",
            "NM_UNIT",
            "NM_PENDEK",
        ],
    });
};