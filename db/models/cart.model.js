import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        quantity: { type: Number },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("cart", cartSchema);
