import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

// ✅ Create Post + Register New User if needed
export const createPostWithUser = async (req, res) => {
  try {
    const {
      // user info
      email,
      password,
      name,
      role,
      // post info
      type,
      personName,
      age,
      gender,
      itemName,
      category,
      brand,
      color,
      title,
      description,
      location,
      lastSeenDate,
      contactName,
      contactPhone,
      contactEmail,
      rewardAmount,
      priority,
    } = req.body;

    // Handle uploaded images (person/item/profile)
    let images = [];
    if (req.files) {
      // Person images (multiple)
      if (req.files.personImages) {
        req.files.personImages.forEach((file) => {
          const full = (file.path || '').replace(/\\\\/g, '/');
          const idx = full.indexOf('/uploads/');
          const url = idx >= 0 ? full.slice(idx) : `/uploads/${file.filename}`;
          images.push({ url, caption: title || 'Person image', uploadedAt: new Date() });
        });
      }
      // Item images (multiple)
      if (req.files.itemImages) {
        req.files.itemImages.forEach((file) => {
          const full = (file.path || '').replace(/\\\\/g, '/');
          const idx = full.indexOf('/uploads/');
          const url = idx >= 0 ? full.slice(idx) : `/uploads/${file.filename}`;
          images.push({ url, caption: title || 'Item image', uploadedAt: new Date() });
        });
      }
      // Profile image (single)
      if (req.files.profileImage) {
        const f = req.files.profileImage[0];
        const full = (f.path || '').replace(/\\\\/g, '/');
        const idx = full.indexOf('/uploads/');
        const url = idx >= 0 ? full.slice(idx) : `/uploads/${f.filename}`;
        images.push({ url, caption: 'Profile image', uploadedAt: new Date() });
      }
    }

    // 🔹 1. Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      user = new User({
        email,
        password: hashedPassword,
        name,
        role: role || "user",
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      });

      await user.save();
    }

    // 🔹 2. Parse location if it's a string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        parsedLocation = { address: location };
      }
    }

    // 🔹 3. Create the post
    const post = new Post({
      userId: user._id,
      type,
      personName,
      age,
      gender,
      itemName,
      category,
      brand,
      color,
      title,
      description,
      images,
      location: parsedLocation,
      lastSeenDate,
      contactName,
      contactPhone,
      contactEmail,
      rewardAmount,
      priority: priority || "medium",
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      userId: user._id,
      postId: post._id,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get posts for the authenticated user
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (err) {
    console.error('Error fetching my posts:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update post status (owner only)
export const updatePostStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body; // expected: 'open' | 'closed' | 'resolved'

    if (!['open', 'closed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.status = status;
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error('Error updating post status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate("userId", "name email") // populate user info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single public post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, isPublic: true })
      .populate("userId", "name email");

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error("Error fetching post by id:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get aggregate stats for Impact page
export const getStats = async (req, res) => {
  try {
    const baseMatch = { isPublic: true };
    const [total, resolved, open, last7d, byTypeAgg] = await Promise.all([
      Post.countDocuments(baseMatch),
      Post.countDocuments({ ...baseMatch, status: 'resolved' }),
      Post.countDocuments({ ...baseMatch, status: { $ne: 'resolved' } }),
      Post.countDocuments({ ...baseMatch, createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } }),
      Post.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
    ]);

    const byType = byTypeAgg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});

    res.status(200).json({ success: true, total, resolved, open, last7d, byType });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
