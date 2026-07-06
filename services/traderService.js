import * as traderRepository from "../repositories/traderRepository.js";

export const getTradersService = async (kd_upt) => {
    // Di sini Anda bisa menambahkan logika bisnis tambahan (validasi, pemrosesan data)
    // jika diperlukan. Jika tidak, cukup panggil repository.

    return await traderRepository.findAllTraders(kd_upt);
};

export const getNewTradersService = async (kd_upt) => {
    console.log("--- 3a. Masuk ke Service ---");
    const data = await traderRepository.findAllTradersWithUsers();
    console.log("--- 3b. Selesai panggil Repository ---");

    if (kd_upt) {
        return data.filter(trader => trader.tb_users.some(u => u.KD_UNIT === kd_upt));
    }
    return data;
};