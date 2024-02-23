import joi from "joi";
import { Types } from "mongoose";

// ! add to cart schema
const addToCartSchema = joi
  .object({
    productId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

//   ! user cart schema
const userCartSchema = joi
  .object({
    cartId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
  })
  .required();

//   !  update user cart schema
const updateUserCartSchema = joi
  .object({
    productId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

const removeProductSchema = joi
  .object({
    productId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
  })
  .required();
export {
  addToCartSchema,
  removeProductSchema,
  userCartSchema,
  updateUserCartSchema,
};
