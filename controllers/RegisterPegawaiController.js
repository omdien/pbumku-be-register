import Tb_pegawai from "../models/tb_pegawai.js";
import Tb_user from "../models/tb_user.js";
import Tb_r_upt from "../models/tb_r_upt.js";
import Tb_role from "../models/tb_role.js";

// Get all pegawai
export const getAllDataPegawai = async (req, res) => {
  try {
    const nip = req.params.nip;
    const pegawai = await Tb_pegawai.findAll({

      include: [
        {
          model: Tb_user,
          as: "userData", 
          attributes: [ "EMAIL"], 
          required: false,
        },
        {
          model: Tb_r_upt,
          as: "uptData", 
          attributes: [ "NM_PENDEK_BARU", "NM_UNIT_BARU"], 
          required: false,
        }
      ],
  });
    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// Get one pegawai by NIP
export const getDataPegawaiByNIP = async (req, res) => {
  try {
    const nip = req.params.nip;

    const pegawai = await Tb_pegawai.findOne({
      where: { NIP: nip },
      include: [
        {
          model: Tb_user,
          as: "userData", 
          where: { USERNAME: nip },
          attributes: ["ROLE", "EMAIL"], 
          required: false,
        },
      ],
    });

    if (!pegawai) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};


// Add new pegawai
export const addDataPegawai = async (req, res) => {
  const { NIP, NAMA, JABATAN, KD_UNIT, STATUS, NO_REG, ROLE, EMAIL, } = req.body;

  try {
     const upt = await Tb_r_upt.findOne({ where: { KD_UNIT } });

    if (!upt) {
      return res.status(400).json({ message: "Unit tidak ditemukan untuk kode: " + KD_UNIT });
    }
    const UNIT = upt.NM_PENDEK;

    await Tb_pegawai.create({
      NIP, NAMA, JABATAN, UNIT, KD_UNIT, STATUS:"0", NO_REG
    });

    await Tb_user.create({
      USERNAME: NIP,
      NAMA,
      PASSWORD: null,
      ROLE: ROLE,
      KD_UNIT,
      NO_ID: NIP,
      STATUS: "0",
      ALAMAT: "-",
      EMAIL,
    });

    res.status(201).json({ message: "Pegawai dan user berhasil ditambahkan" });

  } catch (error) {
    console.error("Gagal tambah pegawai dan user:", error);
    res.status(400).json({
      message: "Gagal menambahkan pegawai dan user",
      error: error.message,
    });
  }
};



// Update existing pegawai
export const updateDataPegawai = async (req, res) => {
  const { nip } = req.params;
  const { NAMA, JABATAN, UNIT, KD_UNIT, STATUS, NO_REG, ROLE, EMAIL } = req.body;

  try {
    const pegawai = await Tb_pegawai.findOne({ where: { NIP: nip } });
    if (!pegawai) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    await pegawai.update({ NAMA, JABATAN, UNIT, KD_UNIT, STATUS, NO_REG, EMAIL });

    const user = await Tb_user.findOne({ where: { USERNAME: nip } });

    if (user) {
      await user.update({ ROLE, NAMA, KD_UNIT, EMAIL });
    } else {
       await Tb_user.create({
        USERNAME: nip,
        NAMA,
        ROLE,
        KD_UNIT,
        NO_ID: nip,
        STATUS: "1",
        PASSWORD: null, 
        EMAIL,
        ALAMAT: "-",
      });
    }

    res.json({ message: "Pegawai dan role berhasil diperbarui" });

  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui pegawai", error: error.message });
  }
};


// Delete pegawai
export const deleteDataPegawai = async (req, res) => {
  const { nip } = req.params; 

  try {

    const pegawai = await Tb_pegawai.findOne({ where: { NIP: nip } });

    if (!pegawai) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    await pegawai.destroy();
    await Tb_user.destroy({ where: { USERNAME: nip } });

    res.json({ message: "Pegawai dan user berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: "Gagal menghapus pegawai", error: error.message });
  }
};

{/*
export const getCombinedDataPegawai = async (req, res) => {
  try {
       const pegawai = await Tb_pegawai.findAll();

      const user = await Tb_user.findAll({
        include: {
          model: Tb_pegawai, 
          attr1 : 'KD_UNIT'
        },
      where: {
        KD_UNIT: {
          [Op.ne]: null 
        }
      }
    });

      const gabungan = [
      ...pegawai.map((p) => ({ ...p.dataValues, sumber: "tb_pegawai" })),
      ...user.map((u) => ({ ...u.dataValues, sumber: "tb_user" }))
    ];

    res.json(gabungan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data gabungan", error: error.message });
  }
}; */}

export const getAllRole = async (req, res) => {
  // console.log("👉 getRole() terpanggil");
  try {
    const roles = await Tb_role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};