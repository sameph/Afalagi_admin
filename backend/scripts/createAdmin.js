import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../db/connectDB.js";
import { User } from "../models/user.model.js";

import path from "path";

// Load env first
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function parseArgs() {
  // Simple CLI flags fallback: --email= --name= --password=
  const out = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--(email|name|password)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function ensureConnection() {
  if (mongoose.connection.readyState === 1) return;
  await connectDB();
}

async function main() {
  const args = parseArgs();
  const email = args.email || process.env.ADMIN_EMAIL;
  const name = args.name || process.env.ADMIN_NAME || "Administrator";
  const password = args.password || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Missing required credentials. Provide ADMIN_EMAIL and ADMIN_PASSWORD env vars or pass --email= and --password=.");
    process.exit(1);
  }

  try {
    await ensureConnection();

    let user = await User.findOne({ email });

    const hashedPassword = await bcryptjs.hash(password, 10);

    if (!user) {
      user = new User({
        email,
        name,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        status: "active",
      });
      await user.save();
      console.log(`Admin user created: ${email}`);
    } else {
      const update = {
        name: user.name || name,
        role: "admin",
        isVerified: true,
        status: "active",
      };
      // Only update password if provided via CLI/env (it is required here)
      update.password = hashedPassword;

      await User.updateOne({ _id: user._id }, { $set: update });
      console.log(`Existing user upgraded to admin (and password reset): ${email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err?.message || err);
    process.exit(1);
  }
}

main();
