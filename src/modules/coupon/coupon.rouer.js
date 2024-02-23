import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as couponSchema from "./coupon.schema.js";
import * as couponContrllers from "./coupon.controller.js";

const router = Router({ mergeParams: true });

// ! create coupon
router.post(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  validation(couponSchema.crateCouponSchema),
  asyncHandeler(couponContrllers.cratecoupon)
);
// ! update coupon
router.patch(
  "/:code",
  authMiddleware,
  isAuthrized("admin"),
  validation(couponSchema.updateCouponSchema),
  asyncHandeler(couponContrllers.updateCoupon)
);
// ! delete Coupon
router.delete(
  "/:code",
  authMiddleware,
  isAuthrized("admin"),
  validation(couponSchema.deleteCouponSchema),
  asyncHandeler(couponContrllers.deleteCoupon)
);

// ! get all Coupon
router.get(
  "/",
  authMiddleware,
  isAuthrized("admin"),
  asyncHandeler(couponContrllers.allCoupons)
);
export default router;
