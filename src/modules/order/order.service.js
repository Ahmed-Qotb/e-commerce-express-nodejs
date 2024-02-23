import { cartModel } from "../../../db/models/cart.model.js";
import { productModel } from "../../../db/models/product.model.js";

export const updateStock = async (products, createOrder) => {
  if (createOrder) {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          sold: product.quantity,
          quantity: -product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          sold: -product.quantity,
          quantity: product.quantity,
        },
      });
    }
  }
};

export const clearCart = async (userId) => {
  await cartModel.findOneAndUpdate({ user: userId }, { products: [] });
};
