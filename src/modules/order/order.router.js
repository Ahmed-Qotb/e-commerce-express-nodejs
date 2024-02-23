import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { isAuthrized } from "../../middleware/authrization.middleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as orderSchema from "./orde.schema.js";
import * as orderContrllers from "./order.controller.js";
const router = Router();

// ! create order
router.post(
  "/",
  authMiddleware,
  isAuthrized("user"),
  validation(orderSchema.crateOrderSchema),
  asyncHandeler(orderContrllers.crateOrder)
);

// ! cancel order
router.patch(
  "/:id",
  authMiddleware,
  isAuthrized("user"),
  validation(orderSchema.cancelOrderSchema),
  asyncHandeler(orderContrllers.cancelOrder)
);
export default router;
