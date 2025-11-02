import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
  updateProfile,
  uploadProfileImage,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.put("/profile", verifyToken, updateProfile);
router.post("/profile/image", verifyToken, upload.single('profileImage'), uploadProfileImage);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
