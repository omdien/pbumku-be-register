import express from "express";
import {
    createRegister,
    getUsers,
    createUser,
    getMaxTrader,
    getPropinsi,
    getKota,
    getKotaByIdProp,
    getUPT,
    getUptAll,
    getTrader,
    getTraders,
    getUserName,
    getUser,
    getLayananAll,
    createLayanan,
    createTraderDok,
    getUPTById,
    getLayananByTrader,
    updateTrader,
    updateUser,
    updateLayanan,
    getTraderUPT,
    upTraderUpt,
    createTraderUpt,
    getTraderByNPWP,
    randomString,
    createFolder,
    getDokumen
} from "../controllers/RegisterController.js";

const router = express.Router();

router.post('/register/register', createRegister);
router.get('/register/register-max', getMaxTrader);
router.get('/register/users', getUsers);
router.post('/register/user', createUser);
router.get('/register/propinsi', getPropinsi);
router.get('/register/kota', getKota);
router.get('/register/kota/:id', getKotaByIdProp); // gwt kota by propinsi
router.get('/register/upt', getUPT);
router.get('/register/allupt', getUptAll);
router.get('/register/uptbyid/:id', getUPTById);
router.get('/register/traders', getTraders);
router.get('/register/trader/:kdtrader', getTrader);  // get trader by kode trader
router.get('/register/username/:username', getUserName);
router.get('/register/user/:kdtrader', getUser);  // get user by kode trader
router.get('/register/layanan/alllayanan', getLayananAll);
router.post('/register/crlayanan', createLayanan);
router.post('/register/crtraderdok', createTraderDok);
router.get('/register/getlayanan/:kdtrader', getLayananByTrader);
router.patch('/register/register/:kdtrader', updateTrader); // update trader
router.patch('/register/user/:userid', updateUser); // update user
router.patch('/register/crlayanan/:kode', updateLayanan); // update layanan
router.get('/register/gettraderupt/:kdtrader', getTraderUPT); // get trader & upt in tb_trader_upt
router.patch('/register/uptraderupt/:kdtrader/:kdunit',upTraderUpt); // update trader & upt in tb_trader_upt
router.post('/register/crtraderupt', createTraderUpt); // create trader upt
router.get('/register/tradernpwp/:npwp', getTraderByNPWP);  // get trader by npwp
router.get('/register/filefolder', randomString);  // get trader by npwp
router.post('/register/createfolder/:nmfolder', createFolder);  // get trader by npwp
router.get('/register/dokumen/:fileid/:kddokumen', getDokumen);  // get trader by npwp

export default router;