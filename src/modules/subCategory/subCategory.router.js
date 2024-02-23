import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { fileUpload } from "../../utils/multerCloud.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as subCatSchema from "./subCategory.schema.js";
import * as subCatContrllers from "./subCategory.controller.js";

const router = Router({ mergeParams: true });

// ! create subCategory
router.post(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("subCategory"),
  validation(subCatSchema.cratesubCatSchema),
  asyncHandeler(subCatContrllers.crateSubCat)
);

// ! update subCategory
router.patch(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("subsubCategory"),
  validation(subCatSchema.updatesubCatSchema),
  asyncHandeler(subCatContrllers.updateSubCat)
);

// ! delete subCategory
router.delete(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  validation(subCatSchema.deletesubCatSchema),
  asyncHandeler(subCatContrllers.deleteSubCat)
);

// ! get all subCategories
router.get("/", asyncHandeler(subCatContrllers.allSubCat));

export default router;
