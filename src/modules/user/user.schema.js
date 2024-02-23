import joi from "joi";

// ! sign up schema
const signUpSchema = joi
  .object({
    name: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: joi.ref("password"),
    role: joi.string().valid("user", "admin").required(),
  })
  .required();

// ! activate Account schema
const activateAccountSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

// ! sign schema
const signInSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

// ! forget Code Schema
const forgetCodeSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// ! rest password schema
const restPassSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: joi.ref("password"),
    otp: joi.string().required(),
  })
  .required();

export {
  restPassSchema,
  signInSchema,
  signUpSchema,
  activateAccountSchema,
  forgetCodeSchema,
};
