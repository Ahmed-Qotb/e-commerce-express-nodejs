import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { fileUpload } from "../../utils/multerCloud.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
const router = Router();

export default router;

// ! create brand
router.post(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("logo"),
  validation(brandSchema.createBrandSchema),
  asyncHandeler(brandController.createBrand)
);

// ! update brand schema
router.patch(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().single("logo"),
  validation(brandSchema.updateBrandSchema),
  asyncHandeler(brandController.updateBrand)
);

// ! delete brand
router.delete(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  validation(brandSchema.deleteBrandSchema),
  asyncHandeler(brandController.deleteBrand)
);

// ! get all brands
router.get("/", asyncHandeler(brandController.allBrands));