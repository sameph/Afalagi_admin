import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  inviteAdmin,
  listInvites,
  revokeInvite,
  resendInvite,
  acceptInvite,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin-only endpoints
router.post("/invites", verifyToken, isAdmin, inviteAdmin);
router.get("/invites", verifyToken, isAdmin, listInvites);
router.post("/invites/:id/resend", verifyToken, isAdmin, resendInvite);
router.delete("/invites/:id", verifyToken, isAdmin, revokeInvite);

// Public endpoint to accept invite (requires token), returns auth cookie on success
router.post("/invites/accept", acceptInvite);

export default router;
