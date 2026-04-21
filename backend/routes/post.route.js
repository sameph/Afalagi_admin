import express from "express";
import { createPostWithUser, getAllPosts, getPostById, getMyPosts, updatePostStatus, getStats, notifyMatch, notifyMatchPublic, getPostMatches, updatePostMatchStatus } from "../controllers/post.controller.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST: Create post & register new user if not exists (with optional multiple images)
router.post("/create", upload.fields([
  { name: 'personImages', maxCount: 5 },
  { name: 'itemImages', maxCount: 5 },
  { name: 'profileImage', maxCount: 1 }
]), createPostWithUser);

// GET: Fetch all public posts
router.get("/", getAllPosts);

// GET: Public stats
router.get("/stats/public", getStats);

// GET: Fetch posts for the authenticated user (must come before dynamic :id)
router.get("/mine/me", verifyToken, getMyPosts);

// POST: Notify admin about a claimed match for a post (auth required)
router.post("/:id/match", verifyToken, notifyMatch);

// POST: Public claim (no auth) with contact info
router.post("/:id/match/public", notifyMatchPublic);

// MATCHES: list matches for a post (owner or admin)
router.get("/:id/matches", verifyToken, getPostMatches);

// MATCHES: update match status (owner or admin)
router.patch("/:postId/matches/:matchId", verifyToken, updatePostMatchStatus);

// GET: Fetch a single public post by ID (ObjectId only)
router.get("/:id([0-9a-fA-F]{24})", getPostById);

// PATCH: Update status for a post (owner only)
router.patch("/:id/status", verifyToken, updatePostStatus);

export default router;
