import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User model
      required: true,
    },
    type: {
      type: String,
      enum: ["lost_person", "found_person", "lost_item", "found_item"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    // Person-specific fields
    personName: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    
    // Item-specific fields
    itemName: { type: String },
    category: { type: String },
    brand: { type: String },
    color: { type: String },
    
    // Contact information
    contactName: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    
    // Date and location
    lastSeenDate: { type: Date },
    
    images: [
      {
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      city: String,
      region: String,
      country: String,
    },
    status: {
      type: String,
      enum: ["open", "closed", "resolved"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    rewardAmount: Number,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Register the model
export const Post = mongoose.model("Post", postSchema);
