import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

//Handle any errors generated when you add next to requests
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
