import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

// Users
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const q = (req.query.q || "").trim();

    const filter = {};
    if (q) {
      filter.$or = [
        { email: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);

    // Frontend expects: users, page, total, totalPages
    res.json({ success: true, users: items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.log("Error in getUsers ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.log("Error in updateUserRole ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: "banned" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.log("Error in banUser ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: "active" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.log("Error in unbanUser ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Posts
// Helper to build posts response with optional base filter
async function listPosts(req, res, baseFilter = {}) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const type = (req.query.type || "").trim();
    const status = (req.query.status || "").trim();
    const q = (req.query.q || "").trim();

    const filter = { ...baseFilter };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { personName: { $regex: q, $options: "i" } },
        { itemName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Post.countDocuments(filter),
    ]);

    // Frontend expects: posts, page, total, totalPages
    res.json({ success: true, posts: items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.log("Error in listPosts ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getPosts = async (req, res) => listPosts(req, res);
export const getLostReports = async (req, res) =>
  listPosts(req, res, { type: { $in: ["lost_person", "lost_item"] } });
export const getFoundReports = async (req, res) =>
  listPosts(req, res, { type: { $in: ["found_person", "found_item"] } });
export const getItemsList = async (req, res) =>
  listPosts(req, res, { type: { $in: ["lost_item", "found_item"] } });

export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["open", "closed", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const post = await Post.findByIdAndUpdate(id, { status }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, post });
  } catch (err) {
    console.log("Error in updatePostStatus ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.log("Error in deletePost ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts] = await Promise.all([
      User.countDocuments({}),
      Post.countDocuments({}),
    ]);

    const statusAgg = await Post.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byStatus = statusAgg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});

    const rolesAgg = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const byRole = rolesAgg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});

    res.json({ success: true, stats: { totalUsers, totalPosts, byStatus, byRole } });
  } catch (err) {
    console.log("Error in getDashboardStats ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Weekly stats: returns data array of { name, lost, found } for last 7 days
export const getWeeklyStats = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const agg = await Post.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          isLost: { $cond: [{ $or: [
            { $eq: ["$type", "lost_person"] },
            { $eq: ["$type", "lost_item"] },
          ] }, 1, 0] },
          isFound: { $cond: [{ $or: [
            { $eq: ["$type", "found_person"] },
            { $eq: ["$type", "found_item"] },
          ] }, 1, 0] },
        }
      },
      { $group: { _id: "$day", lost: { $sum: "$isLost" }, found: { $sum: "$isFound" } } },
    ]);

    // Build 7-day series
    const data = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const row = agg.find(a => a._id === key);
      data.push({ name: key, lost: row?.lost || 0, found: row?.found || 0 });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.log("Error in getWeeklyStats ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Monthly overview: last 12 months counts
export const getMonthlyStats = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const agg = await Post.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $project: {
          ym: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          isLost: { $cond: [{ $or: [
            { $eq: ["$type", "lost_person"] },
            { $eq: ["$type", "lost_item"] },
          ] }, 1, 0] },
          isFound: { $cond: [{ $or: [
            { $eq: ["$type", "found_person"] },
            { $eq: ["$type", "found_item"] },
          ] }, 1, 0] },
        }
      },
      { $group: { _id: "$ym", lost: { $sum: "$isLost" }, found: { $sum: "$isFound" } } },
    ]);

    const data = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const row = agg.find(a => a._id === key);
      data.push({ month: key, lost: row?.lost || 0, found: row?.found || 0 });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.log("Error in getMonthlyStats ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Matches (claims)
// Lists match claims across posts with pagination and filters
export const getMatches = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const status = (req.query.status || "").trim(); // pending | approved | rejected
    const type = (req.query.type || "").trim();     // owner | finder
    const q = (req.query.q || "").trim();           // search in claimant/post fields

    const matchStage = {};
    if (status) matchStage["matches.status"] = status;
    if (type) matchStage["matches.type"] = type;

    const pipeline = [
      { $match: {} },
      { $unwind: "$matches" },
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      ...(q
        ? [{
            $match: {
              $or: [
                { title: { $regex: q, $options: "i" } },
                { personName: { $regex: q, $options: "i" } },
                { itemName: { $regex: q, $options: "i" } },
                { "matches.name": { $regex: q, $options: "i" } },
                { "matches.email": { $regex: q, $options: "i" } },
                { "matches.contactPhone": { $regex: q, $options: "i" } },
              ],
            },
          }]
        : []),
      { $sort: { "matches.createdAt": -1 } },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          postTitle: "$title",
          postType: "$type",
          postStatus: "$status",
          matchId: "$matches._id",
          claimantUserId: "$matches.userId",
          claimantName: "$matches.name",
          claimantEmail: "$matches.email",
          claimantPhone: "$matches.contactPhone",
          matchType: "$matches.type",
          message: "$matches.message",
          matchStatus: "$matches.status",
          createdAt: "$matches.createdAt",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const countPipeline = [
      { $match: {} },
      { $unwind: "$matches" },
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      ...(q
        ? [{
            $match: {
              $or: [
                { title: { $regex: q, $options: "i" } },
                { personName: { $regex: q, $options: "i" } },
                { itemName: { $regex: q, $options: "i" } },
                { "matches.name": { $regex: q, $options: "i" } },
                { "matches.email": { $regex: q, $options: "i" } },
                { "matches.contactPhone": { $regex: q, $options: "i" } },
              ],
            },
          }]
        : []),
      { $count: "total" },
    ];

    const [items, totalRes] = await Promise.all([
      Post.aggregate(pipeline),
      Post.aggregate(countPipeline),
    ]);
    const total = totalRes?.[0]?.total || 0;

    res.json({ success: true, matches: items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.log("Error in getMatches ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
