import Tb_r_trader from "../models/tb_r_trader.js";
import Tb_user from "../models/tb_user.js";
import Tb_propinsi from "../models/tb_propinsi.js";
import Tb_kota from "../models/tb_kota.js";
import Tb_r_upt from "../models/tb_r_upt.js";
import Tb_r_layanan from "../models/tb_r_layanan.js";
import Tb_trader_upt from "../models/tb_trader_upt.js";
import Tb_trader_dok from "../models/tb_trader_dok.js";
import { Op, Sequelize } from "sequelize";
import sequelize from "../config/database.js"; // ← pastikan export instance sequelize-nya
import { format } from "date-fns";
import { sendRegistrationConfirmationEmail } from "../services/emailService.js";

// ─────────────────────────────────────────────
// HELPER: Generate unique FILE_ID
// ─────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_RETRIES = 10;

const generateUniqueFileId = async () => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const result = Array.from({ length: 10 }, () =>
            CHARS.charAt(Math.floor(Math.random() * CHARS.length))
        ).join("");

        const exists = await Tb_trader_dok.findOne({
            attributes: ["FILE_ID"],
            where: { FILE_ID: result },
        });

        if (!exists) return result;
    }
    throw new Error("Gagal generate FILE_ID unik setelah " + MAX_RETRIES + " percobaan");
};

// ─────────────────────────────────────────────
// GET: Generate folder/file ID baru
// ─────────────────────────────────────────────
export const randomString = async (req, res) => {
    try {
        const fileId = await generateUniqueFileId();
        res.status(200).json(fileId);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// ─────────────────────────────────────────────
// POST: Registrasi lengkap dalam 1 transaksi atomik
// Menggantikan 6 endpoint terpisah di frontend
// Body: { trader, user, kodeUPT, services: [1|2|3], fileId }
// ─────────────────────────────────────────────
export const registerFull = async (req, res) => {
    const { trader, user, kodeUPT, services, fileId } = req.body;

    // Validasi input dasar sebelum masuk transaksi
    if (!trader || !user || !kodeUPT || !services?.length || !fileId) {
        return res.status(400).json({ msg: "Data tidak lengkap" });
    }

    // ── Validasi duplikat SEBELUM transaksi dimulai ──────────────────────────
    // Cek NPWP — ini root cause duplikasi data di sistem lama
    const existingTrader = await Tb_r_trader.findOne({ where: { NPWP: trader.NPWP } });
    if (existingTrader) {
        return res.status(409).json({ msg: "NPWP sudah terdaftar", field: "NPWP" });
    }

    // Cek username
    const existingUser = await Tb_user.findOne({ where: { USERNAME: user.USERNAME } });
    if (existingUser) {
        return res.status(409).json({ msg: "Username sudah digunakan", field: "USERNAME" });
    }

    const t = await sequelize.transaction();

    try {
        const now = format(new Date(), "yyyy-MM-dd HH:mm:ss");

        // 1. Simpan trader — findOrCreate sebagai lapisan ke-2 anti race condition
        // Mencegah 2 request NPWP sama yang lolos pengecekan awal secara bersamaan
        const [savedTrader, created] = await Tb_r_trader.findOrCreate({
            where: { NPWP: trader.NPWP },
            defaults: { ...trader, FILE_ID: fileId, TGL_DAFTAR: now, LAST_UPDATED: now, STATUS: "0" },
            transaction: t,
        });
        if (!created) {
            await t.rollback();
            return res.status(409).json({ msg: "NPWP sudah terdaftar", field: "NPWP" });
        }
        const kodeTrader = savedTrader.KODE_TRADER;

        // 2. Simpan user
        const savedUser = await Tb_user.create(
            { ...user, KODE_TRADER: kodeTrader, DATE_CREATED: now, LAST_UPDATED: now },
            { transaction: t }
        );

        // 3. Simpan relasi trader-UPT
        await Tb_trader_upt.create(
            {
                KODE_TRADER: kodeTrader,
                KD_UNIT: kodeUPT,
                KODE_TRADER_LOKAL: null,
                STATUS: "0",
                TGL_AKTIF: null,
                USER_UPDATE: null,
                DATE_CREATED: now,
            },
            { transaction: t }
        );

        // 4. Simpan layanan
        // services: [1] = SMKHP, [2] = PBUMKU, [3] = keduanya
        const layananList = services.map((kode) => ({
            KODE_TRADER: kodeTrader,
            KODE_LAYANAN: String(kode),
            STS_VERIFIKASI: "0",
        }));
        await Tb_r_layanan.bulkCreate(layananList, { transaction: t });

        // 5. Simpan referensi dokumen (path dari file server)
        // File upload sudah dilakukan terpisah via /upload endpoint file server
        // Di sini hanya menyimpan metadata DOK_PATH-nya
        const dokList = req.body.dokumen; // [{ DOK_KODE, DOK_PATH }]
        if (dokList?.length) {
            await Tb_trader_dok.bulkCreate(
                dokList.map((d) => ({ FILE_ID: fileId, DOK_KODE: d.DOK_KODE, DOK_PATH: d.DOK_PATH })),
                { transaction: t }
            );
        }

        await t.commit();

        // ── Kirim email konfirmasi SETELAH transaksi commit sukses ──────────────
        // Dibungkus try-catch terpisah: kegagalan kirim email TIDAK boleh
        // menggagalkan response registrasi yang sudah tersimpan di database.
        let emailSent = true;
        try {
            await sendRegistrationConfirmationEmail({
                toEmail: savedUser.EMAIL,
                namaUser: savedUser.NAMA,
                kdUnit: kodeUPT,
            });
        } catch (emailError) {
            emailSent = false;
            console.error("[registerFull] Gagal mengirim email konfirmasi:", emailError.message);
        }

        res.status(201).json({
            msg: "Registrasi berhasil",
            kodeTrader,
            emailSent,
        });
    } catch (error) {
        await t.rollback();
        console.error("[registerFull]", error.message);
        res.status(500).json({ msg: "Registrasi gagal, semua data dibatalkan", detail: error.message });
    }
};

// ─────────────────────────────────────────────
// GET: Semua trader (list)
// ─────────────────────────────────────────────
export const getTraders = async (req, res) => {
    try {
        const response = await Tb_r_trader.findAll({
            attributes: ["KODE_TRADER", "NAMA", "NPWP", "EMAIL", "TELEPON"],
            include: {
                model: Tb_user,
                attributes: ["NAMA"],
                where: { ROLE: 4 },
            },
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getTraders]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data trader" });
    }
};

// ─────────────────────────────────────────────
// GET: Trader by KODE_TRADER
// ─────────────────────────────────────────────
export const getTrader = async (req, res) => {
    try {
        const response = await Tb_r_trader.findOne({
            where: { KODE_TRADER: req.params.kdtrader },
        });
        if (!response) return res.status(404).json({ msg: "Trader tidak ditemukan" });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getTrader]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data trader" });
    }
};

// ─────────────────────────────────────────────
// GET: Trader by NPWP
// ─────────────────────────────────────────────
export const getTraderByNPWP = async (req, res) => {
    try {
        const response = await Tb_r_trader.findOne({
            where: { NPWP: req.params.npwp },
        });
        res.status(200).json(response); // null jika tidak ditemukan (dipakai FE untuk cek)
    } catch (error) {
        console.error("[getTraderByNPWP]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data trader" });
    }
};

// ─────────────────────────────────────────────
// GET: User by KODE_TRADER (role 4 = pengguna jasa)
// ─────────────────────────────────────────────
export const getUser = async (req, res) => {
    try {
        const response = await Tb_user.findOne({
            where: { KODE_TRADER: req.params.kdtrader, ROLE: 4 },
        });
        if (!response) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getUser]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data user" });
    }
};

// ─────────────────────────────────────────────
// GET: Cek username tersedia
// ─────────────────────────────────────────────
export const getUserName = async (req, res) => {
    try {
        const response = await Tb_user.findOne({
            where: { USERNAME: req.params.username },
        });
        res.status(200).json(response); // null = tersedia
    } catch (error) {
        console.error("[getUserName]", error.message);
        res.status(500).json({ msg: "Gagal cek username" });
    }
};

// ─────────────────────────────────────────────
// GET: Semua users
// ─────────────────────────────────────────────
export const getUsers = async (req, res) => {
    try {
        const response = await Tb_user.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error("[getUsers]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data users" });
    }
};

// ─────────────────────────────────────────────
// GET: Propinsi
// ─────────────────────────────────────────────
export const getPropinsi = async (req, res) => {
    try {
        const response = await Tb_propinsi.findAll({
            attributes: [
                [Sequelize.fn("CONCAT", Sequelize.col("KODE_PROPINSI"), "00"), "KODE_PROPINSI"],
                "URAIAN_PROPINSI",
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getPropinsi]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data propinsi" });
    }
};

// ─────────────────────────────────────────────
// GET: Kota by Propinsi — DIPERBAIKI: selalu filter by propinsi
// ─────────────────────────────────────────────
export const getKotaByIdProp = async (req, res) => {
    try {
        const response = await Tb_kota.findAll({
            where: { KODE_PROPINSI: req.params.id.substring(0, 2) },
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getKotaByIdProp]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data kota" });
    }
};

// ─────────────────────────────────────────────
// GET: UPT dengan pagination + search
// ─────────────────────────────────────────────
export const getUPT = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = page * limit;

    const searchWhere = {
        [Op.or]: [
            { KD_UNIT: { [Op.like]: `%${search}%` } },
            { NM_UNIT: { [Op.like]: `%${search}%` } },
        ],
    };

    try {
        const [totalRows, result] = await Promise.all([
            Tb_r_upt.count({ where: searchWhere }),
            Tb_r_upt.findAll({ where: searchWhere, offset, limit, order: [["KD_UNIT", "ASC"]] }),
        ]);

        res.json({
            result,
            page,
            limit,
            totalRows,
            totalPages: Math.ceil(totalRows / limit),
        });
    } catch (error) {
        console.error("[getUPT]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data UPT" });
    }
};

export const getUptAll = async (req, res) => {
    try {
        const response = await Tb_r_upt.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error("[getUptAll]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data UPT" });
    }
};

export const getUPTById = async (req, res) => {
    try {
        const response = await Tb_r_upt.findOne({ where: { KD_UNIT: req.params.id } });
        if (!response) return res.status(404).json({ msg: "UPT tidak ditemukan" });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getUPTById]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data UPT" });
    }
};

// ─────────────────────────────────────────────
// GET: Dokumen trader
// ─────────────────────────────────────────────
export const getDokumen = async (req, res) => {
    try {
        const response = await Tb_trader_dok.findOne({
            where: { FILE_ID: req.params.fileid, DOK_KODE: req.params.kddokumen },
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getDokumen]", error.message);
        res.status(500).json({ msg: "Gagal mengambil dokumen" });
    }
};

// ─────────────────────────────────────────────
// GET: Trader UPT
// ─────────────────────────────────────────────
export const getTraderUPT = async (req, res) => {
    try {
        const response = await Tb_trader_upt.findOne({
            where: { KODE_TRADER: req.params.kdtrader },
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getTraderUPT]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data trader UPT" });
    }
};

// ─────────────────────────────────────────────
// PATCH: Update Trader
// ─────────────────────────────────────────────
export const updateTrader = async (req, res) => {
    try {
        await Tb_r_trader.update(req.body, { where: { KODE_TRADER: req.params.kdtrader } });
        res.status(200).json({ msg: "Trader berhasil diupdate" });
    } catch (error) {
        console.error("[updateTrader]", error.message);
        res.status(500).json({ msg: "Gagal update trader" });
    }
};

// ─────────────────────────────────────────────
// PATCH: Update User
// ─────────────────────────────────────────────
export const updateUser = async (req, res) => {
    try {
        await Tb_user.update(req.body, { where: { USER_ID: req.params.userid } });
        res.status(200).json({ msg: "User berhasil diupdate" });
    } catch (error) {
        console.error("[updateUser]", error.message);
        res.status(500).json({ msg: "Gagal update user" });
    }
};

// ─────────────────────────────────────────────
// PATCH: Update Layanan
// ─────────────────────────────────────────────
export const updateLayanan = async (req, res) => {
    try {
        await Tb_r_layanan.update(req.body, { where: { KODE: req.params.kode } });
        res.status(200).json({ msg: "Layanan berhasil diupdate" });
    } catch (error) {
        console.error("[updateLayanan]", error.message);
        res.status(500).json({ msg: "Gagal update layanan" });
    }
};

// ─────────────────────────────────────────────
// PATCH: Update Trader UPT
// ─────────────────────────────────────────────
export const upTraderUpt = async (req, res) => {
    try {
        await Tb_trader_upt.update(req.body, {
            where: { KODE_TRADER: req.params.kdtrader, KD_UNIT: req.params.kdunit },
        });
        res.status(200).json({ msg: "Trader UPT berhasil diupdate" });
    } catch (error) {
        console.error("[upTraderUpt]", error.message);
        res.status(500).json({ msg: "Gagal update trader UPT" });
    }
};

// ─────────────────────────────────────────────
// GET: Layanan
// ─────────────────────────────────────────────
export const getLayananAll = async (req, res) => {
    try {
        const response = await Tb_r_layanan.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error("[getLayananAll]", error.message);
        res.status(500).json({ msg: "Gagal mengambil data layanan" });
    }
};

export const getLayananByTrader = async (req, res) => {
    try {
        const response = await Tb_r_layanan.findOne({
            where: { KODE_TRADER: req.params.kdtrader },
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("[getLayananByTrader]", error.message);
        res.status(500).json({ msg: "Gagal mengambil layanan trader" });
    }
};

export default registerFull;