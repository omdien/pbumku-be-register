import crypto from "crypto";
import bcrypt from "bcryptjs";
import Tb_user from "../models/tb_user.js";
import Tb_kota from "../models/tb_kota.js"
import tb_log_reset_password from "../models/tb_log_reset_password.js";
import sendResetPasswordEmail from "../models/Forgot.js";
import { Op } from "sequelize";

// buat test
export const getKotaByIdProp = async (req, res) => {
  try {
    const response = await Tb_kota.findAll({
      where: {
        KODE_PROPINSI: req.params.id.substring(0, 2),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Kirim email reset password
export const forgotPassword = async (req, res) => {
  try {
    console.log("📩 Hit endpoint /register/forgot-password");

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email wajib diisi." });

    console.log("✅ Email diterima:", email);

    const user = await Tb_user.findOne({ where: { EMAIL: email } });
    if (!user) {
      console.log("❌ User tidak ditemukan");
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    console.log("✅ User ditemukan:", user.EMAIL);

    const token = crypto.randomBytes(32).toString("hex");
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000);

    console.log("🚨 Akan menyimpan log reset password...");

    await tb_log_reset_password.create({
      email,
      token,
      requestedAt: new Date(),
      expiredAt,
      status: "pending",
      ipAddress: req.ip,
    });

    console.log("✅ Log reset password berhasil disimpan");

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log("📨 Mengirim email ke:", email);

    await sendResetPasswordEmail(email, user.NAMA, resetLink);

    console.log("✅ Email terkirim, mengirim response ke client");
    res.status(200).json({ message: "Link reset password telah dikirim ke email Anda." });

  } catch (error) {
    console.error("❌ Gagal kirim link reset password:", error);
    res.status(500).json({ message: "Terjadi kesalahan." });
  }
};


// Verifikasi token reset password
export const verifyResetToken = async (req, res) => {
  console.log("🔧 Endpoint verifyResetToken terpanggil");
  const { token } = req.params;
  console.log("Token diterima:", token);

  try {
    console.log("📩 Hit endpoint /register/forgot-password/:token");
    console.log("🔍 Token diterima:", token);

    console.log("⏳ Mencari token dalam database...");
    const log = await tb_log_reset_password.findOne({ 
      where: {
        token,
        expiredAt: { [Op.gt]: new Date() },
        status: "pending",
      },
     });
    console.log("✅ Hasil pencarian log:", log);

    if (!log) {
      console.warn("⚠️ Token tidak valid atau sudah kedaluwarsa.");
      return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }

    console.log("✅ Token valid untuk email:", log.email);
    return res.status(200).json({ message: "Token valid.", email: log.email });

  } catch (error) {
    console.error("❌ Gagal verifikasi token:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat verifikasi token." });
  }
};


// reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const log = await tb_log_reset_password.findOne({
      where: {
        token,
        expiredAt: { [Op.gt]: new Date() },
        status: "pending",
      },
    });

    if (!log) return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });

    const user = await Tb_user.findOne({ where: { EMAIL: log.email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ PASSWORD: hashedPassword });

    await log.update({ status: "used" });

    res.status(200).json({ message: "Password berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal reset password:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat reset password." });
  }
};

export default forgotPassword;