import express from "express";
import {
  getAllDataPegawai,
  getDataPegawaiByNIP,
  addDataPegawai,
  updateDataPegawai,
  deleteDataPegawai,
  //getCombinedDataPegawai,
  getAllRole,
} from "../controllers/RegisterPegawaiController.js";

const router = express.Router();

router.get("/register/data/pegawai", getAllDataPegawai);
//router.get("/register/data/pegawai", getCombinedDataPegawai);
router.get("/register/data/pegawai/:nip", getDataPegawaiByNIP);
router.post("/register/data/pegawai", addDataPegawai);
router.put("/register/data/pegawai/:nip", updateDataPegawai);
router.delete("/register/data/pegawai/:nip", deleteDataPegawai);
router.get("/register/data/role", getAllRole);

export default router;