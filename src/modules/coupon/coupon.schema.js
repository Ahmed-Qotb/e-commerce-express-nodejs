import joi from "joi";

// ! create coupon schema
const crateCouponSchema = joi
  .object({
    discount: joi.number().integer().min(1).max(100).required(),
    expires: joi.date().greater(Date.now()).required(),
  })
  .required();

//   ! update coupon schema
const updateCouponSchema = joi
  .object({
    code: joi.string().required(),
    discount: joi.number().integer().min(1).max(100),
    expires: joi.date().greater(Date.now()),
  })
  .required();

  //   ! delete coupon schema
const deleteCouponSchema = joi
  .object({
    code: joi.string().required(),
  })
  .required();
export { crateCouponSchema, updateCouponSchema, deleteCouponSchema };
