import joi from "joi";
import { Types } from "mongoose";

// ! create order schema
const crateOrderSchema = joi
  .object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa"),
    coupon: joi.string(),
  })
  .required();

// ! cancel order schema
const cancelOrderSchema = joi
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
export { crateOrderSchema, cancelOrderSchema };
