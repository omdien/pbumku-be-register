import express from "express";
import {
  getAllPegawai,
  getPegawaiByNIP,
  addPegawai,
  updatePegawai,
  deletePegawai
} from "../controllers/PegawaiController.js";

const router = express.Router();

router.get("/register/pegawai", getAllPegawai);
router.get("/register/pegawai/:nip", getPegawaiByNIP);
router.post("/register/pegawai", addPegawai);
router.put("/register/pegawai/:nip", updatePegawai);
router.delete("/register/pegawai/:nip", deletePegawai);

export default router;