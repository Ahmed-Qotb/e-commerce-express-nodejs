import { categoryModel } from "../../../db/models/category.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";

// ! create category
const crateCat = async (req, res, next) => {
  const user = req.user;
  // ? check for cat image
  if (!req.file) {
    return encodeXText(new Error("cat image required"));
  }

  // ? upload image in cloudnairy
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
    }
  );
  // ? save category in database
  req.body.slug = slugify(req.body.name);
  let cat = await categoryModel.create({
    ...req.body,
    createdBy: user._id,
    image: { id: public_id, url: secure_url },
  });
  if (!cat) {
    return next(new Error("some thing went wrong while creating cat"));
  }

  // ? sending response
  return res.json({
    success: true,
    message: "cat created successfully",
    results: { cat },
  });
};

// ! update category
const updateCat = async (req, res, next) => {
  const user = req.user;

  // ? check for category existance
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  // ? check for owner
  if (category.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? if user want to change image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
      }
    );
    category.image = { id: public_id, url: secure_url };
  }

  // ? if user want to change name
  if (req.body.name) {
    category.name = req.body.name;
    req.body.slug = slugify(req.body.name);
    category.slug = req.body.slug;

    category.save();
  }

  // ? sending response
  return res.json({
    success: true,
    message: "cat updated successfully",
    results: { category },
  });
};

// ! delete Cat
const deleteCat = async (req, res, next) => {
  const user = req.user;

  // ? check for category existance
  const category = await categoryModel.findById(req.params.id);

  if (!category) {
    return next(new Error("category not found !!"));
  }

  // ? check for owner
  if (category.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? delete category
  await categoryModel.findByIdAndDelete(req.params.id);

  // ? delee image from cloudnairy
  await cloudinary.uploader.destroy(category.image.id);

  // ? sending response
  return res.json({
    success: true,
    message: "cat deleted successfully",
  });
};

// ! get all categories
const allCat = async (req, res, next) => {
  const categories = await categoryModel.find();

  return res.json({ success: true, results: { categories } });
};
export { crateCat, deleteCat, updateCat, allCat };
