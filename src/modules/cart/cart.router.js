import { Router } from "express";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as cartSchema from "./cart.schema.js";
import * as cartContrllers from "./cart.controller.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";

const router = Router();

// ! add to cart
router.post(
  "/",
  authMiddleware,
  isAuthrized("user"),
  validation(cartSchema.addToCartSchema),
  asyncHandeler(cartContrllers.addToCart)
);

// ! get user cart
router.get(
  "/",
  authMiddleware,
  isAuthrized("admin", "user"),
  validation(cartSchema.userCartSchema),
  asyncHandeler(cartContrllers.userCart)
);

// ! update user cart
router.patch(
  "/remove",
  authMiddleware,
  isAuthrized("user"),
  validation(cartSchema.updateUserCartSchema),
  asyncHandeler(cartContrllers.updateUserCart)
);

// ! remove Product
router.patch(
  "/:productId",
  authMiddleware,
  isAuthrized("user"),
  validation(cartSchema.removeProductSchema),
  asyncHandeler(cartContrllers.removeProduct)
);

// ! clear cart
router.put(
  "/",
  authMiddleware,
  isAuthrized("user"),
  asyncHandeler(cartContrllers.clearCart)
);
export default router;
