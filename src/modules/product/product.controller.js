import { nanoid } from "nanoid";
import { brandModel } from "../../../db/models/brand.model.js";
import { categoryModel } from "../../../db/models/category.model.js";
import { subCategoryModel } from "../../../db/models/subCategory.Model.js";
import cloudinary from "../../utils/cloud.js";
import { productModel } from "../../../db/models/product.model.js";
import slugify from "slugify";

// ! create product controller
const crateProduct = async (req, res, next) => {
  const user = req.user;
  // ? check for category
  const category = await categoryModel.findById(req.body.category);
  if (!category) {
    return next(new Error("category not found"));
  }

  // ? check for brand
  const brand = await brandModel.findById(req.body.brand);
  if (!brand) {
    return next(new Error("category not found"));
  }

  // ? check for subcategory
  const subCategory = await subCategoryModel.findById(req.body.subCategory);
  if (!subCategory) {
    return next(new Error("subCategory not found"));
  }

  //   ? check files
  if (!req.files) {
    return next(new Error("product images are required"));
  }

  //   ? create folder name
  const cloudFolder = nanoid();

  //   ? upload sub images
  // console.log(req.files.subImages);
  let images = [];
  for (const file of req.files.subImages) {
    // console.log("Processing file:", file);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
      }
    );
    images.push({ id: public_id, url: secure_url });
  }
  // console.log("Uploaded images:", images);
  //   ? upload default image
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.coverImage[0].path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
    }
  );

  //   ? create product
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create({
    ...req.body,
    cloudFolder,
    createdBy: user._id,
    imageCover: { id: public_id, url: secure_url },
    images,
  });
  if (!product) {
    return next(new Error("something went wrong while creating product"));
  }

  //   ? sending response
  return res.json({
    success: true,
    message: "product cerated successfully",
    results: { product },
  });
};

// ! delete product
const deleteProduct = async (req, res, next) => {
  const user = req.user;

  // ? check for product existance
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new Error("product not found !!"));
  }

  // ? check for owner
  if (product.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? delete product
  await productModel.findByIdAndDelete(req.params.id);

  //   // ? delete Cover image from cloudnairy
  //   await cloudinary.uploader.destroy(product.imageCover.id);

  //   // ? delete images from cloudnairy
  //   product.images.forEach(async (image) => {
  //     await cloudinary.uploader.destroy(image.id);
  //   });

  // ? delete images
  const ids = product.images.map((image) => {
    return image.id;
  });
  ids.push(product.imageCover.id);
  await cloudinary.api.delete_resources(ids);
  console.log("here");

  //   ? delete folder
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  );
  // ? sending response
  return res.json({
    success: true,
    message: "product deleted successfully",
  });
};

// ! get all Products
const allProducts = async (req, res, next) => {
  const { page, sort, keyword, category, brand, subCategory } = req.query;
  if (category && !(await categoryModel.findById(category))) {
    return next(new Error("category not found"));
  }
  if (brand && !(await brandModel.findById(brand))) {
    return next(new Error("brand not found"));
  }
  if (subCategory && !(await subCategoryModel.findById(subCategory))) {
    return next(new Error("subCategory not found"));
  }
  
  // ? sort paginate filter search
  const results = await productModel
    .find({ ...req.query })
    .sort(sort)
    .paginate(page)
    .search(keyword);
  // ? sending response
  return res.json({ success: true, result: { results } });
};

export { crateProduct, deleteProduct, allProducts };
