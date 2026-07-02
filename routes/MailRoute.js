import express from "express";
import {
    forgotPassword,
    verifyResetToken,
    resetPassword
} from "../controllers/ForgotController.js";

const router = express.Router();

router.get("/register/test", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});
router.post("/register/forgot-password", forgotPassword)
router.get("/register/reset-password/:token", verifyResetToken);
router.post("/register/reset-password", resetPassword);

export default router;
