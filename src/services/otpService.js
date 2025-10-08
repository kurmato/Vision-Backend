const { UserOtp } = require('../models');
const { sendEmail } = require('../config/mailer');
const OTP_CONFIG = require('../config/otp');
const { Op } = require('sequelize');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createOTP = async (email, mobile, purpose) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_CONFIG.expiryMinutes * 60 * 1000);

  await UserOtp.destroy({
    where: {
      [Op.or]: [
        { email: email || null },
        { mobile: mobile || null }
      ],
      purpose,
      verified: false
    }
  });

  const otpRecord = await UserOtp.create({
    email,
    mobile,
    otp,
    purpose,
    expiresAt,
    verified: false
  });

  return { otp, otpRecord };
};

const sendOTPEmail = async (email, otp, purpose) => {
  const subject = 'Your OTP Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>OTP Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in ${OTP_CONFIG.expiryMinutes} minutes.</p>
      <p>Purpose: ${purpose}</p>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const verifyOTP = async (email, mobile, otp, purpose) => {
  const otpRecord = await UserOtp.findOne({
    where: {
      [Op.or]: [
        { email: email || null },
        { mobile: mobile || null }
      ],
      otp,
      purpose,
      verified: false,
      expiresAt: {
        [Op.gt]: new Date()
      }
    },
    order: [['createdAt', 'DESC']]
  });

  if (!otpRecord) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  otpRecord.verified = true;
  await otpRecord.save();

  return { success: true, message: 'OTP verified successfully', otpRecord };
};

const isOTPVerified = async (email, mobile, purpose) => {
  const recentVerification = await UserOtp.findOne({
    where: {
      [Op.or]: [
        { email: email || null },
        { mobile: mobile || null }
      ],
      purpose,
      verified: true,
      createdAt: {
        [Op.gt]: new Date(Date.now() - 10 * 60 * 1000)
      }
    },
    order: [['createdAt', 'DESC']]
  });

  return !!recentVerification;
};

module.exports = {
  createOTP,
  sendOTPEmail,
  verifyOTP,
  isOTPVerified
};
