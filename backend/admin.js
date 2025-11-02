// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js"; 

// === Replace these values ===
const adminEmail = "admin@gmail.com";
const adminName = "Samuel Ephrem";
const adminPassword = "Admin@123"; 

export const createAdmin = async () => {
  try {
    

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists with that email.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log(admin);
  } catch (err) {
    console.error("Error creating admin:", err);
  } 
};
