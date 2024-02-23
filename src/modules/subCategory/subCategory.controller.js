import { categoryModel } from "../../../db/models/category.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";
import { subCategoryModel } from "../../../db/models/subCategory.Model.js";

// ! create sub category
const crateSubCat = async (req, res, next) => {
  const user = req.user;

  //   ? check for category
  const category = await categoryModel.findById(req.params.category);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  // ? check for sub cat image
  if (!req.file) {
    return encodeXText(new Error("sub cat image required"));
  }

  // ? upload image in cloudnairy
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/subCategory`,
    }
  );
  // ? save sub category in database
  req.body.slug = slugify(req.body.name);
  let subCat = await subCategoryModel.create({
    ...req.params,
    ...req.body,
    createdBy: user._id,
    image: { id: public_id, url: secure_url },
  });
  if (!subCat) {
    return next(new Error("some thing went wrong while creating sub cat"));
  }

  // ? sending response
  return res.json({
    success: true,
    message: "sub cat created successfully",
    results: { subCat },
  });
};

// ! update sub category
const updateSubCat = async (req, res, next) => {
  const user = req.user;

  // ? check for category existance
  const category = await categoryModel.findById(req.params.category);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  // ? check for sub category existance
  const subCategory = await subCategoryModel.findById(req.params.id);

  if (!subCategory) {
    return next(new Error("sub category not found !!"));
  }

  // ? check for sub category parent
  if (subCategory.category.toString() != category._id.toString()) {
    return next(new Error("sub category parent is wrong !!"));
  }

  // ? check for owner
  if (subCategory.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner !!"));
  }

  // ? if user want to change image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/subCategory`,
      }
    );
    subCategory.image = { id: public_id, url: secure_url };
  }

  // ? if user want to change name
  if (req.body.name) {
    subCategory.name = req.body.name;
    req.body.slug = slugify(req.body.name);
    subCategory.slug = req.body.slug;

    subCategory.save();
  }

  // ? sending response
  return res.json({
    success: true,
    message: "sub cat updated successfully",
    results: { subCategory },
  });
};

// ! delete Cat
const deleteSubCat = async (req, res, next) => {
  const user = req.user;
  // ? check for category existance
  const category = await categoryModel.findById(req.params.category);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  // ? check for sub category existance
  const subCategory = await subCategoryModel.findById(req.params.id);

  if (!subCategory) {
    return next(new Error("sub category not found !!"));
  }

  // ? check for sub category parent
  if (subCategory.category.toString() != category._id.toString()) {
    return next(new Error("sub category parent is wrong !!"));
  }

  // ? check for owner
  if (subCategory.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner !!"));
  }

  // ? delete sub category
  await subCategoryModel.findByIdAndDelete(req.params.id);

  // ? delee image from cloudnairy
  await cloudinary.uploader.destroy(category.image.id);

  // ? sending response
  return res.json({
    success: true,
    message: "sub cat deleted successfully",
  });
};

// ! get all sub categories
const allSubCat = async (req, res, next) => {
  // ? check for category existance
  const category = await categoryModel.findById(req.params.category);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  const subCategories = await subCategoryModel
    .find({
      category: req.params.category,
    })
    .populate([
      { path: "category", select: "name slug -_id", populate: "createdBy" },
      { path: "createdBy" },
    ]);

  return res.json({ success: true, results: { subCategories } });
};
export { crateSubCat, deleteSubCat, updateSubCat, allSubCat };
