import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import adminRoutes from "./routes/admin.route.js";

import { createAdmin } from "./admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  createAdmin();
  console.log("Server is running on port: ", PORT);
});
