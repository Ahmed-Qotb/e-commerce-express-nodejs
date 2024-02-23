import joi from "joi";
import { Types } from "mongoose";

//   ! create brand schema
const createBrandSchema = joi
  .object({
    name: joi.string().min(2).max(50).required(),
    categories: joi
      .array()
      .items(
        joi.custom((value, helper) => {
          if (Types.ObjectId.isValid(value)) {
            return true;
          } else {
            return helper.message("invalid id type");
          }
        })
      )
      .required(),
  })
  .required();

//   ! update brand schema
const updateBrandSchema = joi
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
    name: joi.string().min(2).max(50),
    categories: joi.array().items(
      joi.custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
    ),
  })
  .required();

//   ! delete brand schema
const deleteBrandSchema = joi
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
export { deleteBrandSchema, createBrandSchema, updateBrandSchema };
