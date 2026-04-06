// routes/authRoutes.js
import express from "express";
import { registerAdmin, loginAdmin, loginUser,changePassword, forgotPassword, resetPassword } from "../controllers/authController/auth.js";
import { protectUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login",    loginAdmin);
router.post("/admin/forgot-password",        forgotPassword);
router.patch("/admin/reset-password/:token", resetPassword);
router.post("/user/login",     loginUser);
router.patch("/user/change-password", protectUser, changePassword);
    
export default router;