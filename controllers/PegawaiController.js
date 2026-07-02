import Tb_pegawai from "../models/tb_pegawai.js";
import Tb_user from "../models/tb_user.js"; // ⬅️ import model user juga

// Get all pegawai
export const getAllPegawai = async (req, res) => {
  try {
    const pegawai = await Tb_pegawai.findAll();
    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// Get one pegawai by NIP
export const getPegawaiByNIP = async (req, res) => {
  try {
    const pegawai = await Tb_pegawai.findOne({
      where: { NIP: req.params.nip }
    });

    if (!pegawai) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// Add new pegawai
export const addPegawai = async (req, res) => {
  const { NIP, NAMA, JABATAN, UNIT, KD_UNIT, STATUS, NO_REG } = req.body;
  try {
    await Tb_pegawai.create({
      NIP, NAMA, JABATAN, UNIT, KD_UNIT, STATUS, NO_REG
    });
    res.status(201).json({ message: "Pegawai berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ message: "Gagal menambahkan pegawai", error: error.message });
  }
};

// Update existing pegawai
export const updatePegawai = async (req, res) => {
  const { nip } = req.params;
  console.log("NIP:", nip);
  console.log("Data masuk:", req.body);

  try {
    const pegawai = await Tb_pegawai.findOne({ where: { nip } });
    if (!pegawai) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    // Update data pegawai
    await pegawai.update(req.body);

    // Update juga tb_user.nama berdasarkan NIP = USERNAME
    await Tb_user.update(
      { NAMA: req.body.NAMA },       // field yang mau diubah
      { where: { USERNAME: nip } }   // kunci pencocokan
    );

    res.json({ message: "Pegawai berhasil diperbarui (termasuk user)" });
  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui pegawai", error: error.message });
  }
};

// Delete pegawai
export const deletePegawai = async (req, res) => {
  const { NIP } = req.params;
  try {
    const pegawai = await Tb_pegawai.findOne({ where: { NIP } });
    if (!pegawai) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    await pegawai.destroy();
    res.json({ message: "Pegawai berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: "Gagal menghapus pegawai", error: error.message });
  }
};