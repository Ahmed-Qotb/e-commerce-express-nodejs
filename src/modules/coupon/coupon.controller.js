import voucher_codes from "voucher-code-generator";
import { couponModel } from "../../../db/models/coupon.model.js";

// ! create coupon controller
const cratecoupon = async (req, res, next) => {
  const user = req.user;
  // ? generate code
  const code = voucher_codes.generate({
    length: 8,
    count: 5,
  });

  //   ? creating coupon
  const coupon = await couponModel.create({
    code: code[0],
    createdBy: user._id,
    discount: req.body.discount,
    expires: new Date(req.body.expires).getTime(),
  });

  if (!coupon) {
    return next(new Error("something went wrong while creating coupon !!"));
  }

  //   ? sending response
  return res.json({ success: true, results: { coupon } });
};

// ! update coupon controller
const updateCoupon = async (req, res, next) => {
  const user = req.user;

  // ? check for coupon existance
  const coupon = await couponModel.findOne({
    code: req.params.code,
    expires: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new Error("coupon not found or expired !!"));
  }

  // ? check for owner
  if (coupon.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  //   ? update
  if (req.body.discount) {
    coupon.discount = req.body.discount;
    await coupon.save();
  }

  if (req.body.expires) {
    coupon.expires = new Date(req.body.expires).getTime();
    await coupon.save();
  }

  //   ? sending response
  return res.json({
    success: true,
    message: "coupon updated successfully",
    results: { coupon },
  });
};

// ! delete coupon
const deleteCoupon = async (req, res, next) => {
  const user = req.user;

  // ? check for coupon existance
  const coupon = await couponModel.findOne({ code: req.params.code });

  if (!coupon) {
    return next(new Error("coupon not found !!"));
  }

  // ? check for owner
  if (coupon.createdBy.toString() != user._id.toString()) {
    return next(new Error("you are not the owner"));
  }

  // ? delete coupon
  await couponModel.findOneAndDelete({ code: req.params.code });

  // ? sending response
  return res.json({
    success: true,
    message: "coupon deleted successfully",
  });
};

// ! get all coupons
const allCoupons = async (req, res, next) => {
  const user = req.user;

  if (user.role === "admin") {
    const coupons = await couponModel.find();
    return res.json({ success: true, results: { coupons } });
  }

  if (user.role === "seller") {
    const coupons = await couponModel.find({ createdBy: user._id });
    return res.json({ success: true, results: { coupons } });
  }
};
export { cratecoupon, updateCoupon, deleteCoupon, allCoupons };
