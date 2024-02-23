import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "brand name alredy exist"],
      trim: true,
      required: [true, "brand name is required"],
      minLength: [2, "brand name must be bigger than 2 charachters"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: { id: { type: String }, url: { type: String } },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const brandModel = mongoose.model("brand", brandSchema);
