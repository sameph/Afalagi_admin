import { User } from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId).select("role status");
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.status === "banned") {
      return res.status(403).json({ success: false, message: "Account banned" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden - admin only" });
    }

    next();
  } catch (err) {
    console.log("Error in requireAdmin ", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
