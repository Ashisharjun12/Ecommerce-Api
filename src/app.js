import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/ErrorHandler.js";

//create app
const app = express();

//important middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

//routes

//error handel
app.use(errorHandler)

export default app;
