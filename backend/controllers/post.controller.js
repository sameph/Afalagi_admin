import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

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
      // Helper function to process uploaded files
      const processFile = (file, defaultCaption, subdirectory) => {
        // Construct the URL path based on subdirectory
        const url = `/uploads/${subdirectory}/${file.filename}`;
        images.push({ 
          url, 
          caption: title || defaultCaption, 
          uploadedAt: new Date(),
          type: file.fieldname // Store the fieldname to identify the image type
        });
      };



      // Process person images (multiple)
      if (req.files.personImages) {
        req.files.personImages.forEach(file => {
          processFile(file, 'Person image', 'posts/persons');
        });
      }
      
      // Process item images (multiple)
      if (req.files.itemImages) {
        req.files.itemImages.forEach(file => {
          processFile(file, 'Item image', 'posts/items');
        });
      }
      
      // Process profile image (single)
      if (req.files.profileImage) {
        processFile(req.files.profileImage[0], 'Profile image', 'profiles');
      }
    }

    // 🔹 1. Ensure we have an email to associate or create an account
    if (!email) {
      return res.status(400).json({ error: "Email is required to create an account for posting" });
    }

    // 🔹 2. Check if user exists
    let userAlreadyExisted = false;
    let generatedPlainPassword = undefined;
    let user = await User.findOne({ email });

    if (!user) {
      // Generate a random password if none provided
      let finalPassword = password;
      let passwordWasGenerated = false;
      if (!finalPassword) {
        // 12-char alphanumeric random password
        finalPassword = crypto
          .randomBytes(12)
          .toString("base64")
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 12);
        passwordWasGenerated = true;
      }

      // hash password
      const hashedPassword = await bcrypt.hash(finalPassword, 10);

      // verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      user = new User({
        email,
        password: hashedPassword,
        name: (typeof name === 'string' && name.trim()) ? name : (email.includes('@') ? email.split('@')[0] : email),
        role: role || "user",
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      });

      await user.save();

      // Only return temp password if it was generated
      if (passwordWasGenerated) {
        generatedPlainPassword = finalPassword;
      }
    } else {
      userAlreadyExisted = true;
    }

    // 🔹 3. Parse location if it's a string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        parsedLocation = { address: location };
      }
    }

    // 🔹 4. Create the post
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
      userAlreadyExisted: userAlreadyExisted,
      // tempPassword is only present when we created a new account without a provided password
      tempPassword: generatedPlainPassword,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Public match claim (no auth). Accepts name, email or contactPhone, optional message, and match type.
export const notifyMatchPublic = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { type, name, email, contactPhone, message } = req.body || {};

    // Validate post
    const post = await Post.findById(id);
    if (!post || !post.isPublic) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Determine match type if not provided
    const fallbackType = post.type?.startsWith("found") ? "owner" : "finder";
    const matchType = ["owner", "finder"].includes(type) ? type : fallbackType;

    // Basic validation for contact
    if (!name || (!email && !contactPhone)) {
      return res.status(400).json({ success: false, message: "Please provide your name and at least one contact (email or phone)" });
    }

    const match = {
      // userId omitted for public claims
      name: String(name).trim(),
      email: email ? String(email).trim() : undefined,
      contactPhone: contactPhone ? String(contactPhone).trim() : undefined,
      type: matchType,
      message: typeof message === "string" ? message : undefined,
      status: "pending",
      createdAt: new Date(),
    };

    if (!Array.isArray(post.matches)) post.matches = [];

    post.matches.push(match);
    await post.save();

    const added = post.matches[post.matches.length - 1];
    return res.status(201).json({ success: true, matchId: added._id });
  } catch (err) {
    console.error("Error recording public match:", err);
    return res.status(500).json({ success: false, message: "Server error while recording match" });
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

// Get all public posts (newest first)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

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

// Record a match claim for a post (no email)
export const notifyMatch = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const userId = req.userId; // from verifyToken middleware
    const { type, message } = req.body || {};

    // Validate post
    const post = await Post.findById(id);
    if (!post || !post.isPublic) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Get claimant user
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    // Auto-determine match type if not provided
    const fallbackType = post.type?.startsWith("found") ? "owner" : "finder";
    const matchType = ["owner", "finder"].includes(type) ? type : fallbackType;

    // Build match object
    const match = {
      userId,
      name: user.name,
      email: user.email,
      type: matchType,
      message: typeof message === "string" ? message : undefined,
      status: "pending",
      createdAt: new Date(),
    };

    // Ensure matches array exists
    if (!Array.isArray(post.matches)) post.matches = [];

    // Prevent duplicate pending match by SAME user & SAME matchType
    const existing = post.matches.find(
      (m) =>
        m.userId &&
        m.userId.toString() === userId.toString() &&
        m.type === matchType &&
        m.status === "pending"
    );

    if (existing) {
      return res.status(200).json({
        success: true,
        matchId: existing._id,
        duplicate: true,
      });
    }

    // Push new match
    post.matches.push(match);
    await post.save();

    const added = post.matches[post.matches.length - 1];

    return res.status(201).json({
      success: true,
      matchId: added._id,
      count: post.matches.length,
    });
  } catch (err) {
    console.error("Error recording match:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while recording match",
    });
  }
};


// Get matches for a post (admin or post owner only)
export const getPostMatches = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const requesterId = req.userId;

    const [post, requester] = await Promise.all([
      Post.findById(id).select('userId matches'),
      User.findById(requesterId).select('role'),
    ]);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isOwner = post.userId.toString() === requesterId;
    const isAdmin = requester?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const matches = (post.matches || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error('Error fetching matches:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a match status (admin or post owner only)
export const updatePostMatchStatus = async (req, res) => {
  try {
    const { postId, matchId } = req.params;
    const { status } = req.body; // 'pending' | 'approved' | 'rejected'
    const requesterId = req.userId;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [post, requester] = await Promise.all([
      Post.findById(postId).select('userId matches'),
      User.findById(requesterId).select('role'),
    ]);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isOwner = post.userId.toString() === requesterId;
    const isAdmin = requester?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const match = (post.matches || []).find(m => m._id.toString() === matchId);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

    match.status = status;
    await post.save();

    return res.status(200).json({ success: true, match });
  } catch (err) {
    console.error('Error updating match status:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
