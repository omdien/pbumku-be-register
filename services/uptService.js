import * as uptRepo from "../repositories/uptRepository.js";

export const getUptByKode = async (kdUnit) => {
    try {
        const upt = await uptRepo.getUptByKode(kdUnit);
        return upt;
    } catch (error) {
        throw error;
    }
};