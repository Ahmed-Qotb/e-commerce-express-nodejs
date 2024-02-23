import { orderModel } from "../../../db/models/order.model.js";
import { productModel } from "../../../db/models/product.model.js";
import { reviewModel } from "../../../db/models/review.model.js";

// ! create review controller
const createReview = async (req, res, next) => {
  const user = req.user;

  //   ? check poduct existance
  const product = await productModel.findById(req.params.productId);
  if (!product) {
    return next(new Error("product not found"));
  }

  //   ? check product in order
  const order = await orderModel.findOne({
    user: user._id,
    status: "deliverd",
    "products.productId": req.params.productId,
  });

  if (!order) {
    return next(new Error("can not review this order"));
  }

  //   ? check for past reviews
  if (await reviewModel.findOne({ createdBy: user._id })) {
    return next(new Error("you alredy reviwed"));
  }

  //   ? create review
  const review = await reviewModel.create({
    ...req.body,
    ...req.params,
    createdBy: user._id,
    orderId: order._id,
  });

  if (!review) {
    return next(new Error("something went wrong while creating review"));
  }

  //   ? calculate avrage rate
  let calcRate = 0;
  const reviews = await reviewModel.find({ productId: req.params.productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRate += reviews[i].rating;
  }
  product.averageRate = calcRate / reviews.length;
  await product.save();

  //   ? sending response
  return res.json({
    success: true,
    message: "review created successfully",
    results: { review },
  });
};

// ! update review controller
const updateReview = async (req, res, next) => {
  const user = req.user;
  const review = await reviewModel.updateOne(
    {
      _id: req.params.id,
      productId: req.params.productId,
      createdBy: user._id,
    },
    { ...req.body }
  );

  if (!review) {
    return next(
      new Error("some thing went wrong while updating or you ae not the owner")
    );
  }

  //   ? if user sent rating
  if (req.body.rating) {
    //   ? check poduct existance
    const product = await productModel.findById(req.params.productId);
    if (!product) {
      return next(new Error("product not found"));
    }

    //   ? calculate avrage rate
    let calcRate = 0;
    const reviews = await reviewModel.find({ productId: req.params.productId });

    for (let i = 0; i < reviews.length; i++) {
      calcRate += reviews[i].rating;
    }
    product.averageRate = calcRate / reviews.length;
    await product.save();
  }

  // ? sending response
  return res.json({
    success: true,
    message: "reviwe updated successfully",
  });
};
export { createReview, updateReview };
