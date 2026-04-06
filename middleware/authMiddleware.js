// middleware/authMiddleware.js
import jwt   from "jsonwebtoken";
import Admin from "../models/AdminModel/Admin.js";
import User  from "../models/UserModel/User.js";

// ─── Protect Admin routes ─────────────────────────────────────────────────────
export const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const token      = authHeader.split(" ")[1];
    const decoded    = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Not an admin token" });

    req.admin = await Admin.findById(decoded.id).select("-password"); // 👈 req.admin
    next();
  } catch {
    res.status(401).json({ message: "Token failed or expired" });
  }
};

// ─── Protect User routes ──────────────────────────────────────────────────────
export const protectUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user")
      return res.status(403).json({ message: "Not a user token" });

    req.user = await User.findById(decoded.id).select("-password"); // 👈 req.user
    next();
  } catch {
    res.status(401).json({ message: "Token failed or expired" });
  }
};