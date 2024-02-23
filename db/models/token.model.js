import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    agent: { type: String },
    expiredAt: { type: String },
  },
  { timestamps: true }
);

export const tokenModel = mongoose.model("token", tokenSchema);
 