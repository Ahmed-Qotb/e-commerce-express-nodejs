import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "title alredy exist"],
      trim: true,
      required: [true, "title is required"],
      minLength: [2, "product name must be bigger than 2 charachters"],
      maxLength: [200, "product name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minLength: [10, "description name must be bigger than 2 charachters"],
      maxLength: [500, "description name too long"],
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
      default: 0,
    },
    imageCover: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },

    sold: { type: Number, default: 0 },
    rateCount: Number,
    rateAvg: {
      type: Number,
      max: 5,
      min: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cloudFolder: { type: String, unique: true, required: true },
    averageRate: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);

// ? help query paginate
productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 2;
  const skip = limit * (page - 1);

  return this.skip(skip).limit(limit);
};

// ? help query search
productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
  }
};
// ? virtuals
productSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }

  return this.price;
});

productSchema.virtual("review", {
  ref: "review",
  localField: "_id",
  foreignField: "productId",
});

// ? methods
productSchema.methods.inStock = function (requiredQuantity) {
  return this.quantity >= requiredQuantity ? true : false;
};
export const productModel = mongoose.model("product", productSchema);
