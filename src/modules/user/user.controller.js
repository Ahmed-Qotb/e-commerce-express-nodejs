import { userModel } from "../../../db/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails.js";
import { resetPassTemp, signUpTemp } from "../../utils/htmlTemplates.js";
import { tokenModel } from "../../../db/models/token.model.js";
import { cartModel } from "../../../db/models/cart.model.js";

// ! sign up controller
const signUp = async (req, res, next) => {
  // ? checking if email already exists
  const checkUser = await userModel.findOne({ email: req.body.email });

  if (checkUser) {
    return next(new Error("user already exists !!"));
  }

  // ? if password and re pass doasnt match
  if (req.body.password != req.body.repeat_password) {
    return next(new Error("password doesn't match !!"));
  }

  // ? generating token
  const token = jwt.sign(
    {
      email: req.body.email,
    },
    process.env.TOKEN_SECRET
  );

  // ? creating user
  const user = new userModel({ ...req.body });
  await user.save();

  // ? create confirmation link
  const confirmationLink = `http://localhost:3000/user/activate_account/${token}`;

  // ? send email
  const messageSent = await sendEmail({
    to: user.email,
    subject: "activate account",
    html: signUpTemp(confirmationLink),
  });

  if (!messageSent) {
    return next(new Error("message not sent"));
  }

  // ? sending response
  return res.json({
    success: true,
    message: "user created successfully check email for activation",
  });
};

// ! activate account controller
const activateAccount = async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);

  // ? searching for user and updating confirmed email
  const user = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true }
  );

  // ? if user not exist
  if (!user) {
    return next(new Error("user not found !!"));
  }

  // ? create cart
  await cartModel.create({ user: user._id });

  // ? sending response
  return res.json({ success: true, message: "email activated :D" });
};

// ! sign in controller
const signIn = async (req, res, next) => {
  // ? checking if email already exists
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error("user not found !!"));
  }

  // ? check for email confirmed
  if (!user.confirmEmail) {
    return next(new Error("email not confirmed"));
  }

  // ? checking for matching password
  const isMatch = bcrypt.compareSync(req.body.password, user.password);

  if (!isMatch) {
    return next(new Error("passwrd incorect"));
  }

  // ? generating token
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  // ? save token in token model
  const isToken = await tokenModel.create({ token, userId: user._id });
  if (!isToken) {
    return next(new Error("token failed !!"));
  }

  // ? sending response
  return res.json({
    success: true,
    message: "log in successfull",
    result: { token },
  });
};

const forgetCode = async (req, res, next) => {
  // console.log("here");

  // ? checking for email existance
  const user = await userModel.findOne({ email: req.body.email });
  // console.log("here");

  // ? if user not found
  if (!user) {
    return next(new Error("user not found"));
  }

  // ? generate forget code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ? sending otb to database
  await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      otp,
      otpExpiry: Date.now() + 60 * 1000, // otp time 1 min
    }
  );

  // ? sending email
  const emailMessage = await sendEmail({
    to: user.email,
    subject: "reset password otp",
    html: resetPassTemp(otp),
  });

  // ? if send email failed
  if (!emailMessage) {
    return next(new Error("message not sent"));
  }

  // ? sending
  return res.json({ success: true, message: "check your email" });
};

// ! reset pass controller
const restPass = async (req, res, next) => {
  // ? checking if email already exists
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error("user not found !!"));
  }

  // ? checking otp
  if (user.otp != req.body.otp || user.otpExpiry < Date.now()) {
    return next(new Error("otp expired or wrong !"));
  }

  // ? if password and re pass doasnt match
  if (req.body.password != req.body.repeat_password) {
    return next(new Error("password doesn't match !!"));
  }

  // ? hashing password
  const hashedPass = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.HASH_ROUNDS)
  );

  // ? changing password
  await userModel.findOneAndUpdate(
    { email: req.body.email },
    { password: hashedPass }
  );

  // ? sending response
  return res.json({ success: true, message: "password changed succefully" });
};

export { restPass, signUp, activateAccount, signIn, forgetCode };
