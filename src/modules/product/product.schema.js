import joi from "joi";
import { Types } from "mongoose";

// ! create product schema
const crateProductSchema = joi
  .object({
    title: joi.string().min(2).max(20).required(),
    description: joi.string().min(10).max(500),
    quantity: joi.number().integer().min(1).required(),
    price: joi.number().integer().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    subCategory: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    brand: joi
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

// ! delete product schema
const deleteProductSchema = joi
  .object({
    id: joi
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

export { crateProductSchema, deleteProductSchema };
