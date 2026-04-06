// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host:   "smtp.hostinger.com",
  port:   465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});



/**
 * @param {string} to        - recipient email
 * @param {string} name      - recipient name
 * @param {string} password  - plain-text password to share
 * @param {string} adminName - name of the admin who created the account
 */
export const sendWelcomeEmail = async (to, name, password, adminName) => {
  const mailOptions = {
    from: `"CreativeOS Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Account Has Been Created",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;
                  border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px;">
        <h2 style="color: #333;">Welcome, ${name}! 👋</h2>
        <p style="color: #555;">
          Your account has been created by <strong>${adminName}</strong>.
          Here are your login credentials:
        </p>

        <table style="width:100%; background:#f9f9f9; border-radius:6px; padding:16px;
                      border-collapse:collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; color:#555; font-weight:bold;">Email</td>
            <td style="padding: 8px; color:#333;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color:#555; font-weight:bold;">Password</td>
            <td style="padding: 8px; color:#333;">${password}</td>
          </tr>
        </table>

        <p style="color:#e53935; font-size:13px;">
          ⚠️ Please change your password after your first login.
        </p>
        <p style="color:#999; font-size:12px; margin-top:24px;">
          If you didn't expect this email, please contact your administrator.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: `"CreativeOS Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;
                  border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px;">
        <h2 style="color: #333;">Password Reset</h2>
        <p style="color: #555;">You requested a password reset. Click the button below:</p>
        
        <a href="${resetUrl}"
           style="display:inline-block; padding: 12px 24px; background:#4F46E5;
                  color:#fff; border-radius:6px; text-decoration:none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color:#e53935; font-size:13px;">This link expires in 15 minutes.</p>
        <p style="color:#999; font-size:12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};