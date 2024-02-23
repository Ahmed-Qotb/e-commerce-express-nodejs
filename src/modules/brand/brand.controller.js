import slugify from "slugify";
import { brandModel } from "../../../db/models/brand.model.js";
import { categoryModel } from "../../../db/models/category.model.js";
import cloudinary from "../../utils/cloud.js";

// ! create brand controller
const createBrand = async (req, res, next) => {
  const user = req.user;
  // ? check categories
  const { categories } = req.body;

  categories.forEach(async (catId) => {
    const category = await categoryModel.findById(catId);
    if (!category) {
      return next(new Error(`category with id [ ${catId} ] not found !!`));
    }
  });

  //  ? check for brand logo
  if (!req.file) {
    return encodeXText(new Error("brand logo required"));
  }

  // ? upload logo in cloudnairy
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/brand`,
    }
  );

  //   ? save brand in database
  req.body.slug = slugify(req.body.name);
  let brand = await brandModel.create({
    ...req.body,
    createdBy: user._id,
    logo: { id: public_id, url: secure_url },
  });
  if (!brand) {
    return next(new Error("some thing went wrong while creating brand"));
  }
  //   ? save brands in each category
  categories.forEach(async (category) => {
    const cat = await categoryModel.findById(category);
    cat.brands.push(brand._id);
    cat.save();
  });

  // ? sending response
  return res.json({
    success: true,
    message: "brand created successfully",
    results: { brand },
  });
};

// ! update brand controller
const updateBrand = async (req, res, next) => {
  const user = req.user;

  // ? check for brand existance
  const brand = await brandModel.findById(req.params.id);

  if (!brand) {
    return next(new Error("brand not found !!"));
  }

  // ? check for owner
  if (brand.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? if user want to change image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/brand`,
      }
    );
    brand.logo = { id: public_id, url: secure_url };
  }

  // ? if user want to change name
  if (req.body.name) {
    brand.name = req.body.name;
    req.body.slug = slugify(req.body.name);
    brand.slug = req.body.slug;

    brand.save();
  }

  // ? sending response
  return res.json({
    success: true,
    message: "brand updated successfully",
    results: { brand },
  });
};

// ! delete bran controller
const deleteBrand = async (req, res, next) => {
  const user = req.user;

  // ? check for brand existance
  const brand = await brandModel.findById(req.params.id);

  if (!brand) {
    return next(new Error("brand not found !!"));
  }

  // ? check for owner
  if (brand.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? delete brand
  await brandModel.findByIdAndDelete(req.params.id);

  // ? delete image from cloudnairy
  await cloudinary.uploader.destroy(brand.image.id);

  // ? delete brand from categories
  await categoryModel.updateMany({}, { $pull: { brands: brandModel._id } });

  // ? sending response
  return res.json({
    success: true,
    message: "cat deleted successfully",
  });
};

// ! get all brands controller
const allBrands = async (req, res, next) => {
  const brands = await brandModel.find();
[]
  return res.json({ success: true, results: { brands } });
};
export { createBrand, updateBrand, deleteBrand, allBrands };
