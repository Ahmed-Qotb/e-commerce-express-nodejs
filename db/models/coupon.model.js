import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "coupon name is required"],
    },
    expires: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const couponModel = mongoose.model("coupon", couponSchema);
