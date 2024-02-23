import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      minLength: [2, "review text must be bigger than 2 charachters"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "order",
      required: true,
    },
  },
  { timestamps: true }
);

export const reviewModel = mongoose.model("review", reviewSchema);
