import { Router } from "express";
import { validation } from "../../middleware/valedation.middleware.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as userControllers from "./user.controller.js";
import * as userSchema from "./user.schema.js";
const router = Router();

// ! sign up
router.post(
  "/signUp",
  validation(userSchema.signUpSchema),
  asyncHandeler(userControllers.signUp)
);

// ! activate Account
router.get(
  "/activate_account/:token",
  validation(userSchema.activateAccountSchema),
  asyncHandeler(userControllers.activateAccount)
);
// ! log in
router.post(
  "/signIn",
  validation(userSchema.signInSchema),
  asyncHandeler(userControllers.signIn)
);
// ! send forget code
router.patch(
  "/forgetCode",
  validation(userSchema.forgetCodeSchema),
  asyncHandeler(userControllers.forgetCode)
);

// ! reset password
router.patch(
  "/restPass",
  validation(userSchema.restPassSchema),
  asyncHandeler(userControllers.restPass)
);
export default router;
