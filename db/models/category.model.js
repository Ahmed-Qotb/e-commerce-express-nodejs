import mongoose from "mongoose";
import { subCategoryModel } from "./subCategory.Model.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "category already exist"],
      trim: true,
      required: [true, "category is required"],
      minLength: [2, "category name must be bigger than 2 charachters"],
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
    brands: [
      {
        type: mongoose.Types.ObjectId,
        ref: "brand",
        required: true,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ? category post deleteone
categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await subCategoryModel.deleteMany({
      category: this._id,
    });
  }
);

// ? vertual sub category field
categorySchema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});

export const categoryModel = mongoose.model("category", categorySchema);
