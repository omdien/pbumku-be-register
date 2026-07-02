// Tambahkan route ini di file router registrasi Anda
// Contoh: routes/RegisterRoute.js

import express from "express";
import {
    randomString,
    registerFull,          // ← BARU: endpoint atomik
    getTraders,
    getTrader,
    getTraderByNPWP,
    getUser,
    getUserName,
    getUsers,
    getPropinsi,
    getKotaByIdProp,       // ← DIPERBAIKI: selalu filter by propinsi
    getUPT,
    getUptAll,
    getUPTById,
    getDokumen,
    getTraderUPT,
    updateTrader,
    updateUser,
    updateLayanan,
    upTraderUpt,
    getLayananAll,
    getLayananByTrader,
} from "../controllers/RegisterController.js";

const router = express.Router();

// ── Registrasi ─────────────────────────────────
router.get("/register/filefolder",           randomString);
router.post("/register/register-full",       registerFull);      // ← ENDPOINT UTAMA BARU

// ── Lookup (GET) ────────────────────────────────
router.get("/register/traders",              getTraders);
router.get("/register/trader/:kdtrader",     getTrader);
router.get("/register/tradernpwp/:npwp",     getTraderByNPWP);
router.get("/register/user/:kdtrader",       getUser);
router.get("/register/username/:username",   getUserName);
router.get("/register/users",                getUsers);
router.get("/register/propinsi",             getPropinsi);
router.get("/register/kota/:id",             getKotaByIdProp);   // ← filter by propinsi
router.get("/register/upt",                  getUPT);
router.get("/register/allupt",               getUptAll);
router.get("/register/uptbyid/:id",          getUPTById);
router.get("/register/dokumen/:fileid/:kddokumen", getDokumen);
router.get("/register/gettraderupt/:kdtrader",    getTraderUPT);
router.get("/register/getlayanan/:kdtrader",      getLayananByTrader);
router.get("/register/layanan",              getLayananAll);

// ── Update (PATCH) ──────────────────────────────
router.patch("/register/register/:kdtrader",         updateTrader);
router.patch("/register/user/:userid",               updateUser);
router.patch("/register/crlayanan/:kode",            updateLayanan);
router.patch("/register/uptraderupt/:kdtrader/:kdunit", upTraderUpt);

export default router;