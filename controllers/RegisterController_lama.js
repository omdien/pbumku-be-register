// import { response } from "express";
import Tb_r_trader from "../models/tb_r_trader.js";
import Tb_user from "../models/tb_user.js";
import Tb_propinsi from "../models/tb_propinsi.js";
import Tb_kota from "../models/tb_kota.js";
import Tb_r_upt from "../models/tb_r_upt.js";
import Tb_r_layanan from "../models/tb_r_layanan.js";
import Tb_trader_upt from "../models/tb_trader_upt.js";
import Tb_trader_dok from "../models/tb_trader_dok.js";
import { Op, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";

export const randomString = async (req, res) => {
  let randomChar =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let tersedia = true;
  while (tersedia) {
    result = "";
    for (let i = 0; i < 10; i++) {
      result += randomChar.charAt(Math.floor(Math.random() * randomChar.length));
    }
    try {
      const response = await Tb_trader_dok.findOne({
        attributes: ["FILE_ID"],
        where: {
          FILE_ID: result
        }
      });
      if (response === null) {
        tersedia = false;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  res.status(200).json(result);
};

// Get All Trader
export const getTraders = async (req, res) => {
  try {
    const response = await Tb_r_trader.findAll({
      attributes: ["KODE_TRADER", "NAMA", "NPWP", "EMAIL", "TELEPON"],
      include: { 
        model: Tb_user, 
        attributes: ["NAMA"],
        where: { ROLE: 4 } },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Save Registrasi/Trader
export const createRegister = async (req, res) => {
  try {
    await Tb_r_trader.create(req.body);
    res.status(201).json({ msg: "Trader Created" });
  } catch (error) {
    console.log(error.message);
  }
};

// Save Registrasi/Trader
export const createTraderDok = async (req, res) => {
  try {
    await Tb_trader_dok.create(req.body);
    res.status(201).json({ msg: "Trader DocumentCreated" });
  } catch (error) {
    console.log(error.message);
  }
};

// export const createRegister = async (req, res) => {
//   if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
//   const folderName = './public/images/dok/traders/' + req.body.FILE_ID;
//   try {
//     if (!fs.existsSync(folderName, { recursive: true })) {
//       fs.mkdirSync(folderName);
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
//   const imageNPWP = req.files.FILE_NPWP;
//   const imageKTP = req.files.FILE_KTP;
//   const imageNIB = req.files.FILE_NIB;
//   const fileSizeNPWP = imageNPWP.data.length;
//   const fileSizeKTP = imageKTP.data.length;
//   const fileSizeNIB = imageNIB.data.length;
//   const extNPWP = path.extname(imageNPWP.name);
//   const extKTP = path.extname(imageKTP.name);
//   const extNIB = path.extname(imageNIB.name);
//   const fileNameNPWP = imageNPWP.md5 + extNPWP;
//   const fileNameKTP = imageKTP.md5 + extKTP;
//   const fileNameNIB = imageNIB.md5 + extNIB;
//   const urlNPWP = `${req.protocol}://${req.get("host")}/images/dok/traders/${req.body.FILE_ID}/${fileNameNPWP}`;
//   const urlKTP = `${req.protocol}://${req.get("host")}/images/dok/traders/${req.body.FILE_ID}/${fileNameKTP}`;
//   const urlNIB = `${req.protocol}://${req.get("host")}/images/dok/traders/${req.body.FILE_ID}/${fileNameNIB}`;
//   const allowedType = ['.png', '.jpg', '.jpeg', '.pdf'];
//   if (!allowedType.includes(extNPWP.toLowerCase())) return res.status(422).json({ msg: "Invalid Images NPWP" });
//   if (!allowedType.includes(extKTP.toLowerCase())) return res.status(422).json({ msg: "Invalid Images KTP" });
//   if (!allowedType.includes(extNIB.toLowerCase())) return res.status(422).json({ msg: "Invalid Images NIB" });
//   if (fileSizeNPWP > 5000000) return res.status(422).json({ msg: "Image NPWP must be less than 5 MB" });
//   if (fileSizeKTP > 5000000) return res.status(422).json({ msg: "Image KTP must be less than 5 MB" });
//   if (fileSizeNIB > 5000000) return res.status(422).json({ msg: "Image NIB must be less than 5 MB" });

//   imageNPWP.mv(`${folderName}/${fileNameNPWP}`, async (err) => {
//     if (err) return res.status(500).json({ msg: err.message });
//     imageKTP.mv(`${folderName}/${fileNameKTP}`);
//     imageNIB.mv(`${folderName}/${fileNameNIB}`);
//     try {
//       await Tb_r_trader.create(req.body);
//       await Tb_trader_dok.create({
//         FILE_ID: req.body.FILE_ID,
//         DOK_KODE: 1,
//         DOK_PATH: urlNPWP,
//       })
//       await Tb_trader_dok.create({
//         FILE_ID: req.body.FILE_ID,
//         DOK_KODE: 2,
//         DOK_PATH: urlKTP,
//       })
//       await Tb_trader_dok.create({
//         FILE_ID: req.body.FILE_ID,
//         DOK_KODE: 3,
//         DOK_PATH: urlNIB,
//       })
//       res.status(201).json({ msg: "User Created" });
//     } catch (error) {
//       console.log(error.message);
//     }
//   });
// };

// Get Users
export const getUsers = async (req, res) => {
  try {
    const response = await Tb_user.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Get Users
export const getUserName = async (req, res) => {
  try {
    const response = await Tb_user.findOne({
      where: {
        USERNAME: req.params.username,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Save User
export const createUser = async (req, res) => {
  try {
    await Tb_user.create(req.body);
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
};

// Get Max Kode_Trader
export const getMaxTrader = async (req, res) => {
  try {
    const response = await Tb_r_trader.max("KODE_TRADER");
    res.status(201).json({ response });
  } catch (error) {
    console.log(error.message);
  }
};

// Get Propinsi
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
    console.log(error.message);
  }
};

// Get Kabupaten/Kota
export const getKota = async (req, res) => {
  try {
    const response = await Tb_kota.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

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

// Get UPT
export const getUPT = async (req, res) => {
  // get query params
  const page = parseInt(req.query.page) || 0; //default page is 0
  const limit = parseInt(req.query.limit) || 10; //default limit is 10
  const search = req.query.search_query || ""; //default search is empty string

  const offset = page * limit;
  const totalRows = await Tb_r_upt.count({
    where: {
      [Op.or]: [
        {
          KD_UNIT: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          NM_UNIT: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });
  const totalPages = Math.ceil(totalRows / limit);

  const result = await Tb_r_upt.findAll({
    where: {
      [Op.or]: [
        {
          KD_UNIT: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          NM_UNIT: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [["KD_UNIT", "ASC"]],
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPages: totalPages,
  });

  // try {
  //   const response = await Tb_r_upt.findAll();
  //   res.status(200).json(response);
  // } catch (error) {
  //   console.log(error.message);
  // }
};

// Get Kabupaten/Kota
export const getUptAll = async (req, res) => {
  try {
    const response = await Tb_r_upt.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUPTById = async (req, res) => {
  try {
    const response = await Tb_r_upt.findOne({
      where: {
        KD_UNIT: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Get Trader by Kode Trader
export const getTrader = async (req, res) => {
  try {
    const response = await Tb_r_trader.findOne({
      where: {
        KODE_TRADER: req.params.kdtrader,
      },
    });
    // if (response.FILE_ID != "") {
    //   const folderName = './public/images/dok/traders/' + response.FILE_ID;
    //   if (!fs.existsSync(folderName)) {
    //     fs.mkdirSync(folderName);
    //   }
    // }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Get Trader by NPWP
export const getTraderByNPWP = async (req, res) => {
  try {
    const response = await Tb_r_trader.findOne({
      where: {
        NPWP: req.params.npwp,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const response = await Tb_user.findOne({
      where: {
        [Op.and]: [
          {
            KODE_TRADER: req.params.kdtrader,
          },
          {
            ROLE: 4,
          },
        ],
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};
// Get Trader Layanan
export const getLayananAll = async (req, res) => {
  try {
    const response = await Tb_r_layanan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Save Layanan
export const createLayanan = async (req, res) => {
  try {
    await Tb_r_layanan.create(req.body);
    res.status(201).json({ msg: "Layanan Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const getLayananByTrader = async (req, res) => {
  try {
    const response = await Tb_r_layanan.findOne({
      where: {
        KODE_TRADER: req.params.kdtrader,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Update Trader
export const updateTrader = async (req, res) => {
  try {
    await Tb_r_trader.update(req.body, {
      where: {
        KODE_TRADER: req.params.kdtrader,
      },
    });
    res.status(200).json({ msg: "Trader Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    await Tb_user.update(req.body, {
      where: {
        USER_ID: req.params.userid,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// Save Layanan
export const updateLayanan = async (req, res) => {
  try {
    await Tb_r_layanan.update(req.body, {
      where: {
        KODE: req.params.kode,
      },
    });
    res.status(200).json({ msg: "Layanan Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// get tb_trader_upt
export const getTraderUPT = async (req, res) => {
  try {
    const response = await Tb_trader_upt.findOne({
      where: {
        KODE_TRADER: req.params.kdtrader,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Update Trader UPT
export const upTraderUpt = async (req, res) => {
  try {
    await Tb_trader_upt.update(req.body, {
      where: {
        [Op.and]: [
          {
            KODE_TRADER: req.params.kdtrader,
          },
          {
            KD_UNIT: req.params.kdunit,
          },
        ],
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// Save Layanan
export const createTraderUpt = async (req, res) => {
  try {
    await Tb_trader_upt.create(req.body);
    res.status(201).json({ msg: "Trader UPT Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const createFolder = async (req, res) => {
  const folderName = './public/images/dok/trader/' + req.params.nmfolder;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    res.status(200).json(folderName + req.params.nmfile);
  } catch (err) {
    console.error(err);
  }
};

export const getDokumen = async (req, res) => {
  try {
    const response = await Tb_trader_dok.findOne({
      where: {
        [Op.and]: [
          {
            FILE_ID: req.params.fileid,
          },
          {
            DOK_KODE: req.params.kddokumen,
          },
        ],
      },
    });
    res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export default createRegister;
