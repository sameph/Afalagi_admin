import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { AdminInvite } from "../models/adminInvite.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { sendAdminInviteEmail } from "../mailtrap/emails.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const INVITE_TTL_DAYS = 7;

const buildAcceptUrl = (token) => {
  const base = process.env.CLIENT_URL || "http://localhost:5173";
  const url = new URL(base);
  // Frontend should implement this route to accept invites
  url.pathname = "/accept-admin";
  url.searchParams.set("token", token);
  return url.toString();
};

export const inviteAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "User is already an admin" });
    }

    // Optional: prevent multiple active invites for same email
    await AdminInvite.updateMany(
      { email, status: "pending" },
      { $set: { status: "revoked" } }
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invite = await AdminInvite.create({
      email,
      token,
      invitedBy: req.userId,
      expiresAt,
    });

    const acceptURL = buildAcceptUrl(token);
    await sendAdminInviteEmail(email, acceptURL);

    res.status(201).json({ success: true, invite });
  } catch (error) {
    console.log("Error in inviteAdmin ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listInvites = async (req, res) => {
  try {
    const invites = await AdminInvite.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, invites });
  } catch (error) {
    console.log("Error in listInvites ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const revokeInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const invite = await AdminInvite.findById(id);
    if (!invite) return res.status(404).json({ success: false, message: "Invite not found" });
    if (invite.status !== "pending") {
      return res.status(400).json({ success: false, message: `Cannot revoke invite with status ${invite.status}` });
    }
    invite.status = "revoked";
    await invite.save();
    res.status(200).json({ success: true, invite });
  } catch (error) {
    console.log("Error in revokeInvite ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const invite = await AdminInvite.findById(id);
    if (!invite) return res.status(404).json({ success: false, message: "Invite not found" });

    // Refresh token and expiry
    invite.token = crypto.randomBytes(32).toString("hex");
    invite.expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
    invite.status = "pending";
    await invite.save();

    const acceptURL = buildAcceptUrl(invite.token);
    await sendAdminInviteEmail(invite.email, acceptURL);

    res.status(200).json({ success: true, invite });
  } catch (error) {
    console.log("Error in resendInvite ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token is required" });

    const invite = await AdminInvite.findOne({ token });
    if (!invite) return res.status(400).json({ success: false, message: "Invalid or expired invite" });

    if (invite.status !== "pending") {
      return res.status(400).json({ success: false, message: `Invite already ${invite.status}` });
    }
    if (invite.expiresAt.getTime() < Date.now()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ success: false, message: "Invite expired" });
    }

    let user = await User.findOne({ email: invite.email });
    if (user) {
      user.role = "admin";
      user.isVerified = true;
      await user.save();
    } else {
      if (!name || !password) {
        return res.status(400).json({ success: false, message: "Name and password are required to create admin account" });
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      user = await User.create({
        email: invite.email,
        name,
        password: hashedPassword,
        isVerified: true,
        role: "admin",
      });
    }

    invite.status = "accepted";
    invite.acceptedAt = new Date();
    await invite.save();

    // Log in the user by setting auth cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({ success: true, message: "Invitation accepted", user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log("Error in acceptInvite ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== Admin Data APIs =====
// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const q = (req.query.q || "").trim();

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, page, total, totalPages: Math.ceil(total / limit), users });
  } catch (error) {
    console.log("Error in getUsers ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Helper to build post filter based on query and allowed types
const buildPostFilter = (req, allowedTypes) => {
  const q = (req.query.q || "").trim();
  const status = (req.query.status || "").trim();
  const typeParam = (req.query.type || "").trim();

  let types = allowedTypes;
  if (typeParam) {
    const inputTypes = typeParam.split(",").map((t) => t.trim()).filter(Boolean);
    if (inputTypes.length) types = inputTypes;
  }

  const filter = { type: { $in: types } };
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { personName: { $regex: q, $options: "i" } },
      { itemName: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }
  if (status && ["open", "closed", "resolved"].includes(status)) {
    filter.status = status;
  }
  return filter;
};

// Generic posts endpoint for admin with optional type filter
// GET /api/admin/posts?type=lost_item,found_item&status=open&q=phone&page=1&limit=20
export const getAdminPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const allowed = [
      "lost_person",
      "found_person",
      "lost_item",
      "found_item",
    ];
    const filter = buildPostFilter(req, allowed);

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, page, total, totalPages: Math.ceil(total / limit), posts });
  } catch (error) {
    console.log("Error in getAdminPosts ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Lost reports: lost_person + lost_item
// GET /api/admin/reports/lost
export const getLostReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const filter = buildPostFilter(req, ["lost_person", "lost_item"]);

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, page, total, totalPages: Math.ceil(total / limit), posts });
  } catch (error) {
    console.log("Error in getLostReports ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Found reports: found_person + found_item
// GET /api/admin/reports/found
export const getFoundReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const filter = buildPostFilter(req, ["found_person", "found_item"]);

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, page, total, totalPages: Math.ceil(total / limit), posts });
  } catch (error) {
    console.log("Error in getFoundReports ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// All items (not persons): lost_item + found_item
// GET /api/admin/items
export const getAllItems = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const filter = buildPostFilter(req, ["lost_item", "found_item"]);

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({ success: true, page, total, totalPages: Math.ceil(total / limit), posts });
  } catch (error) {
    console.log("Error in getAllItems ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
