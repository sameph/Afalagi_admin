import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getUsers,
  updateUserRole,
  banUser,
  unbanUser,
  getPosts,
  updatePostStatus,
  deletePost,
  getDashboardStats,
  getWeeklyStats,
  getMonthlyStats,
  getLostReports,
  getFoundReports,
  getItemsList,
  getMatches,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, requireAdmin);

// Dashboard stats
router.get("/dashboard", getDashboardStats);
router.get("/stats/weekly", getWeeklyStats);
router.get("/stats/monthly", getMonthlyStats);

// Users management
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/ban", banUser);
router.patch("/users/:id/unban", unbanUser);

// Posts moderation
router.get("/posts", getPosts);
router.patch("/posts/:id/status", updatePostStatus);
router.delete("/posts/:id", deletePost);

// Matches moderation
router.get("/matches", getMatches);

// Aliases expected by frontend helpers
router.get("/reports/lost", getLostReports);
router.get("/reports/found", getFoundReports);
router.get("/items", getItemsList);

export default router;
