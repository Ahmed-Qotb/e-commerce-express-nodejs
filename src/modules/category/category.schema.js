import joi from "joi";
import { Types } from "mongoose";

// ! create cat schema
const crateCatSchema = joi
  .object({
    name: joi.string().min(2).max(500).required(),
  })

  .required();
// ! update Category Schema
const updateCatSchema = joi
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
    name: joi.string().min(2).max(500),
  })
  .required();

// ! delete cat schema
const deleteCatSchema = joi
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

export { crateCatSchema, updateCatSchema, deleteCatSchema };
