import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { fileUpload } from "../../utils/multerCloud.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as productSchema from "./product.schema.js";
import * as productContrllers from "./product.controller.js";
import reviewRouter from "../review/review.router.js";
const router = Router({ mergeParams: true });

// ! go to review
router.use("/:productId/review", reviewRouter);

// ! create product
router.post(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  fileUpload().fields([
    { name: "coverImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validation(productSchema.crateProductSchema),
  asyncHandeler(productContrllers.crateProduct)
);

// ! delete product
router.delete(
  "/:id",
  authMiddleware,
  isAuthrized("admin"),
  validation(productSchema.deleteProductSchema),
  asyncHandeler(productContrllers.deleteProduct)
);

// ! get all poducts
router.get("/", asyncHandeler(productContrllers.allProducts));

export default router;
