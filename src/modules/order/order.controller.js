import { cartModel } from "../../../db/models/cart.model.js";
import { couponModel } from "../../../db/models/coupon.model.js";
import { orderModel } from "../../../db/models/order.model.js";
import { productModel } from "../../../db/models/product.model.js";
import cloudinary from "../../utils/cloud.js";
import createInvoice from "../../utils/pdfInvoice.js";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../../utils/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ! create order controller
const crateOrder = async (req, res, next) => {
  const { payment, address, coupon, phone } = req.body;
  const user = req.user;
  // ? check coupon
  let chechCoupon;
  if (coupon) {
    chechCoupon = await couponModel.findOne({
      code: coupon,
      expires: { $gt: Date.now() },
    });

    if (!chechCoupon) {
      return next(new Error("copon is invalid"));
    }
  }

  // ? get products from cart
  const cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    return next(
      new Error("cart not found or something went wrong while getting cart")
    );
  }

  const products = cart.products;

  if (products.length < 1) {
    return next(new Error("cart is empty"));
  }

  //   ? check products
  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await productModel.findById(products[i].productId);

    if (!product) {
      return next(new Error(`${products[i].productId} product not found`));
    }

    if (!product.inStock(products[i].quantity)) {
      return next(
        new Error(
          `${products[i].productId} product out of stock only ${product.quantity}`
        )
      );
    }

    orderProducts.push({
      name: product.title,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
      productId: product._id,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }

  // ? create order in databaase
  const order = await orderModel.create({
    user: user._id,
    address,
    phone,
    payment,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: chechCoupon?._id,
      code: chechCoupon?.code,
      discount: chechCoupon?.discount,
    },
  });

  if (!order) {
    return next(new Error("order failed"));
  }

  // ? generat invoice
  const invoice = {
    shipping: {
      name: user.name,
      address: order.address,
      country: "egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfpath = path.join(__dirname, `./../../tempInvoice/${order._id}.pdf`);
  createInvoice(invoice, pdfpath);

  // ? upload invoice
  const { secure_url, punlic_id } = await cloudinary.uploader.upload(pdfpath, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices`,
  });

  // ? add invoice in data base
  order.receipt = { url: secure_url, id: punlic_id };

  // ? send email to user "invoice"
  //   const isSent = await sendEmail({
  //     to: user.email,
  //     subject: "order receipt",
  //     attachments: [{ path: secure_url, contentType: "application/pdf" }],
  //   });

  //   if (!isSent) {
  //     return next(new Error("send email failed"));
  //   }

  // ? update stock
  updateStock(order.products, true);

  //   ? clear cart
  clearCart(user._id);

  if (req.body.payment === "visa") {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    // ? coupon stripe
    let couopnExisted;
    if (order.coupon.code !== undefined) {
      couopnExisted = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }
    // console.log(order.products);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: { order_id: order._id.toString() },
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
              // Add more product details as needed
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: couopnExisted ? [{ coupon: couopnExisted.id }] : [],
    });

    //   ? sending response
    return res.json({ success: true, results: { url: session.url } });
  }

  //   ? sending response
  return res.json({ success: true, results: { order } });
};

// ! cancel order controller
const cancelOrder = async (req, res, next) => {
  // ? check order
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new Error("invalid order id"));
  }
  // ? check status
  if (order.status === "deliverd" || order.status === "shipped") {
    return next(new Error("order can't be canceled"));
  }

  //   ? cancel order
  order.status = "canceled";
  await order.save();

  // ? update stock
  updateStock(order.products, false);

  //   ? sending response
  return res.json({ success: true, message: "order cancelled" });
};

// ! webhook
const orderWebhook = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.ENDPOINT_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const orderId = event.data.object.metadata.order_id;

  if (event.type === "checkout.session.completed") {
    // change order statement

    await orderModel.findByIdAndUpdate(orderId, {
      status: "visa paid",
    });
    return;
  }
  await orderModel.findByIdAndUpdate(orderId, {
    status: "visa failed",
  });
  return;
  // // Return a 200 response to acknowledge receipt of the event
  // response.send();
};
export { crateOrder, cancelOrder, orderWebhook };
