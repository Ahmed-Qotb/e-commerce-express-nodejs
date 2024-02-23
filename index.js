import express from "express";
import { connectDB } from "./db/connection.js";
import dotenv from "dotenv";
import categoryRouter from "./src/modules/category/category.router.js";
import userRouter from "./src/modules/user/user.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from "./src/modules/coupon/coupon.rouer.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;
// ? parse
app.use(express.json());

app.listen(port, () =>
  console.log(`e commerce app listening at http://localhost:${port}`)
);

// ? pdfinvoice
// createInvoice()
// const invoice = {
//   shipping: {
//     name: "John Doe",
//     address: "1234 Main Street",
//     city: "San Francisco",
//     state: "CA",
//     country: "US",
//     postal_code: 94111
//   },
//   items: [
//     {
//       item: "TC 100",
//       description: "Toner Cartridge",
//       quantity: 2,
//       amount: 6000
//     },
//     {
//       item: "USB_EXT",
//       description: "USB Cable Extender",
//       quantity: 1,
//       amount: 2000
//     }
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234
// };

// createInvoice(invoice, "invoice.pdf");

// ? db connection
await connectDB();

// ? cors
// const whitelist = ["http://127.0.0.1:5500"];
// app.use((req, res, next) => {
//   if (req.originalUrl.includes("/user/activate_account")) {
//     res.setHeader("Access-Controll-Allow-Origin", "*");
//     res.setHeader("Access-Controll-Allow-Methods", "GET");
//     return next();
//   }

//   if (!whitelist.includes(req.headers("origin"))) {
//     return next(new Error("blocked by cors"));
//   }

//   res.setHeader("Access-Controll-Allow-Origin", "*");
//   res.setHeader("Access-Controll-Allow-Headers", "*");
//   res.setHeader("Access-Controll-Allow-Methods", "*");
//   res.setHeader("Access-Controll-Private-Network", true);

//   return next();
// });
app.use(cors());

// ! apis
// ? category apis
app.use("/category", categoryRouter);

// ? brand apis
app.use("/brand", brandRouter);

// ? user apis
app.use("/user", userRouter);

// ? coupon apis
app.use("/coupon", couponRouter);

// ? product apis
app.use("/product", productRouter);

// ? cart apis
app.use("/cart", cartRouter);

// ? order apis
app.use("/order", orderRouter);

// ! global error handler
app.use((error, req, res, next) => {
  return res.json({
    succes: false,
    message: error.message,
    stack: error.stack,
  });
});

// ! not found page handler
app.all("*", (req, res, next) => {
  return res.json({ success: false, message: "page not found" });
});
