import express from "express";
import { sendOtp, verifyOtp } from "../controllers/emailVerificationController.js";

const router = express.Router();

router.post("/send-otp/:email", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;