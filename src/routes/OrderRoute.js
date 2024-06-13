import express from "express";
import { createOrder, getOneOrder } from "../controllers/OrderController.js";
import auth from "../middlewares/Auth.js";
const orderRoute = express.Router();

//define routes
orderRoute.post("/create", auth, createOrder);
orderRoute.get("/:id", auth, getOneOrder);

export default orderRoute;
