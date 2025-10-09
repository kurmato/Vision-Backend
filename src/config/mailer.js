import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendVerificationEmail = async (to, message) => {
  try {
    const mailOptions = {
      from: {
        name: "VisioPictures Verification",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: "Email Verification - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">
            ${message}
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If you didn't request this code, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
