import mongoose from "mongoose";

const adminInviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "revoked", "expired"], default: "pending" },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

adminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminInvite = mongoose.model("AdminInvite", adminInviteSchema);
