import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/ErrorHandler.js";
import userRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import productroute from "./routes/ProductRoute.js";
import orderRoute from "./routes/OrderRoute.js";
import paymentRoute from "./routes/PaymentRoute.js"

//create app
const app = express();

//important middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//check server
app.get("/", (req, res) => {
  res.json({ message: "server is running...👋🏻" });
});

//health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is healthy..😃" });
});

//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productroute);
app.use("/api/v1", orderRoute);
app.use("api/v1" , paymentRoute)

//error handel
app.use(errorHandler);

export default app;
