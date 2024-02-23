import joi from "joi";
import { Types } from "mongoose";

// ! create review schema
const createReview = joi
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
    text: joi.string(),
    rating: joi.number().min(1).max(5).required(),
  })
  .required();

//   ! update review schema
const updateReview = joi
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
    productId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    text: joi.string(),
    rating: joi.number().min(1).max(5),
  })
  .required();
export { createReview, updateReview };
