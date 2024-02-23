import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    payment: { type: String, default: "cash", enum: ["cash", "visa"] },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    receipt: {
      url: String,
      id: String,
    },
    coupon: {
      id: { type: mongoose.Types.ObjectId, ref: "coupon" },
      code: String,
      discount: Number,
    },
    status: {
      type: String,
      default: "placed",
      enum: [
        "placed",
        "shipped",
        "deliverd",
        "canceled",
        "refunded",
        "visa paid",
        "visa failed",
      ],
    },
  },
  { timestamps: true }
);

// ? virtuals
orderSchema.virtual("finalPrice").get(function () {
  if (this.coupon) {
    return this.price - (this.price * this.coupon.discount) / 100;
  }

  return this.price;
});

export const orderModel = mongoose.model("order", orderSchema);
