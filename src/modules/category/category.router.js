import { Router } from "express";
import * as catContrllers from "./category.controller.js";
import * as catSchema from "./category.schema.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { fileUpload } from "../../utils/multerCloud.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
const router = Router();

// ! go to sub category router
router.use("/:category/subCategory", subCategoryRouter);

// ! create category
router.post(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("category"),
  validation(catSchema.crateCatSchema),
  asyncHandeler(catContrllers.crateCat)
);

// ! update category
router.patch(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("category"),
  validation(catSchema.updateCatSchema),
  asyncHandeler(catContrllers.updateCat)
);

// ! delete category
router.delete(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  validation(catSchema.deleteCatSchema),
  asyncHandeler(catContrllers.deleteCat)
);

// ! get all categories
router.get("/", asyncHandeler(catContrllers.allCat));

export default router;
