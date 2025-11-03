import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  inviteAdmin,
  listInvites,
  revokeInvite,
  resendInvite,
  acceptInvite,
  getUsers,
  getAdminPosts,
  getLostReports,
  getFoundReports,
  getAllItems,
  getWeeklyStats,
  getMonthlyOverview,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin-only endpoints
router.post("/invites", verifyToken, isAdmin, inviteAdmin);
router.get("/invites", verifyToken, isAdmin, listInvites);
router.post("/invites/:id/resend", verifyToken, isAdmin, resendInvite);
router.delete("/invites/:id", verifyToken, isAdmin, revokeInvite);

// Public endpoint to accept invite (requires token), returns auth cookie on success
router.post("/invites/accept", acceptInvite);

// Admin data APIs
router.get("/users", verifyToken, isAdmin, getUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);
router.get("/posts", verifyToken, isAdmin, getAdminPosts);
router.get("/reports/lost", verifyToken, isAdmin, getLostReports);
router.get("/reports/found", verifyToken, isAdmin, getFoundReports);
router.get("/items", verifyToken, isAdmin, getAllItems);
router.get("/stats/weekly", verifyToken, isAdmin, getWeeklyStats);
router.get("/stats/monthly", verifyToken, isAdmin, getMonthlyOverview);

export default router;
