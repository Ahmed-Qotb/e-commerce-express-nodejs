import { cartModel } from "../../../db/models/cart.model.js";
import { productModel } from "../../../db/models/product.model.js";

//   ! add add to cart controller
const addToCart = async (req, res, next) => {
  const user = req.user;

  //   ? check product existance
  const product = await productModel.findById(req.body.productId);
  if (!product) {
    return next(new Error("product not found"));
  }

  //   ? check stock
  if (!product.inStock(req.body.quantity)) {
    return next(new Error(`out of stock only ${product.quantity} avilable`));
  }

  // ? check product existance inthe cart
  const isProductInCart = await cartModel.findOne({
    user: user._id,
    "products.productId": req.body.productId,
  });
  if (isProductInCart) {
    const theProduct = isProductInCart.products.find((prd) => {
      return prd.productId.toString() === req.body.productId.toString();
    });

    // ? check stock
    if (product.inStock(theProduct.quantity + req.body.quantity)) {
      theProduct.quantity = theProduct.quantity + req.body.quantity;
      await isProductInCart.save();
      //   ? sending response
      return res.json({
        success: true,
        message: "added to cart successfully",
        results: { isProductInCart },
      });
    } else {
      return next(new Error(`sorry , only ${product.quantity} avilable`));
    }
  }
  //   ? checking for cart and adding product in product array
  const cart = await cartModel.findOneAndUpdate(
    { user: user._id },
    {
      $push: {
        products: {
          productId: req.body.productId,
          quantity: req.body.quantity,
        },
      },
    },
    { new: true }
  );

  await cart.save();

  if (!cart) {
    return next(new Error("something went wrong while adding to cart"));
  }

  //   ? sending response
  return res.json({
    success: true,
    message: "added to cart successfully",
    results: { cart },
  });
};

// ! get user cart
const userCart = async (req, res, next) => {
  const user = req.user;

  //   ? if role = user
  if (user.role === "user") {
    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) {
      return next(new Error("something went wrong while getting user cart !!"));
    }

    return res.json({ success: true, results: { cart } });
  }

  //   ? if user role admin
  const cart = await cartModel.findById(req.body.cartId);
  if (!cart) {
    return next(new Error("something went wrong while getting user cart !!"));
  }
  return res.json({ success: true, results: { cart } });
};

// ! update user cart controller
const updateUserCart = async (req, res, next) => {
  const user = req.user;

  const cart = await cartModel.findOneAndUpdate(
    {
      user: user._id,
      "products.productId": req.body.productId,
    },
    {
      "products.$.quantity": req.body.quantity,
    },
    {
      new: true,
    }
  );
  if (!cart) {
    return next(new Error("something went wrong while updating cart"));
  }
  //   ? seinding response
  return res.json({
    success: true,
    message: "cart updated",
    results: { cart },
  });
};

// ! remove product controller
const removeProduct = async (req, res, next) => {
  const user = req.user;

  //   ? check product existance
  const product = await productModel.findById(req.params.productId);
  if (!product) {
    return next(new Error("product not found"));
  }

  //   ? remove from cart
  const cart = await cartModel.findOneAndUpdate(
    { user: user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );
  //   console.log(cart);
  if (!cart) {
    return next(new Error("something went wrong while removing cart"));
  }

  // ? sending response
  return res.json({
    success: true,
    message: "product removed successfully",
    results: { cart },
  });
};

// ! clear cart controller
const clearCart = async (req, res, next) => {
  const user = req.user;

  //   ? clearing products array
  const cart = await cartModel.findOneAndUpdate(
    { user: user._id },
    {
      products: [],
    },
    { new: true }
  );
  if (!cart) {
    return next(new Error("something went wrong while removing cart"));
  }

  //   ? sending respones
  return res.json({
    success: true,
    message: "cart cleared successfully",
    results: { cart },
  });
};
export { clearCart, addToCart, userCart, updateUserCart, removeProduct };
