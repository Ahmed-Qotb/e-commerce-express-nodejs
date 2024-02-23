import { Router } from "express";
import * as reviewControllers from "./review.controller.js";
import * as reviewSchema from "./review.schema.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";

const router = Router({ mergeParams: true });

// ! create review
router.post(
  "/",
  authMiddleware,
  isAuthrized("user"),
  validation(reviewSchema.createReview),
  asyncHandeler(reviewControllers.createReview)
);
// ! create review
router.patch(
  "/:id",
  authMiddleware,
  isAuthrized("user"),
  validation(reviewSchema.updateReview),
  asyncHandeler(reviewControllers.updateReview)
);

export default router;
