import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "sub Category name alredy exist"],
      trim: true,
      required: [true, "name is required"],
      minLength: [2, "sub category name must be bigger than 2 charachters"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    image: { id: { type: String }, url: { type: String } },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
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

export const subCategoryModel = mongoose.model(
  "subCategory",
  subCategorySchema
);
