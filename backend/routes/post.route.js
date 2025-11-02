import express from "express";
import { createPostWithUser, getAllPosts, getPostById, getMyPosts, updatePostStatus, getStats } from "../controllers/post.controller.js";
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

// GET: Fetch a single public post by ID
router.get("/:id", getPostById);

// PATCH: Update status for a post (owner only)
router.patch("/:id/status", verifyToken, updatePostStatus);

export default router;
