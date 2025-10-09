import crypto from "crypto";
import EmailVerification from "../models/EmailVerification.js";
import Requirement from "../models/Requirement.js";
import { sendVerificationEmail } from "../config/mailer.js";

export const sendOtp = async (req, res) => {
  try {
    // Get email from route parameter
    const { email } = req.params;
    console.log("Email from params:", email);

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const initialotp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(initialotp)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailVerification.upsert({ email, otp: hashedOtp, expiresAt });

    await sendVerificationEmail(
      email,
      `Your OTP is ${initialotp}. It is valid for 5 minutes.`
    );

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const record = await EmailVerification.findOne({
      where: { email, otp: hashedOtp },
    });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > record.expiresAt) {
      await record.destroy();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    await record.destroy();

    const existingRequirement = await Requirement.findOne({ where: { email } });
    if (existingRequirement) {
      existingRequirement.isEmailVerified = true;
      await existingRequirement.save();
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      isEmailVerified: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
