const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth/auth-route");
const uploadImageRouter = require("./routes/admin/product-route");

mongoose
  .connect("mongodb+srv://rahul2008d:aacd1134@cluster0.vg8gj.mongodb.net/")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["*"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expired",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/product", uploadImageRouter);

app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
