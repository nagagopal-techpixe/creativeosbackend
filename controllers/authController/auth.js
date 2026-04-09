// controllers/authController.js
import Admin from "../../models/Adminmodel/Admin.js";
import User  from "../../models/UserModel/User.js";
import bcrypt from "bcryptjs";
import jwt    from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../utils/sendEmail.js";

const generateAdminToken = (id) =>
  jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "30d" });

const generateUserToken = (id) =>
  jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "30d" });

//  Admin Register (one-time setup) 
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin  = await Admin.create({ name, email, password: hashed });

    res.status(201).json({
      _id:     admin._id,
      name:    admin.name,
      email:   admin.email,
      role:    admin.role,
      message: "Admin registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Admin Login 
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt:", email, password);

    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (isMatch) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateAdminToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  User Login only 
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("createdBy", "name email");

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdBy: user.createdBy, // shows which admin created this user
        token:     generateUserToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken  = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken  = hashedToken;
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(admin.email, resetUrl);
      res.json({ message: "Reset link sent to email" });
    } catch (mailError) {
      admin.resetPasswordToken  = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save();
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token }       = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },  // not expired
    });

    if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    admin.password            = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken  = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};