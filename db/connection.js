import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(console.log("db connected"))
    .catch((error) => {
      console.log("db connection failed", error);
    });
};
