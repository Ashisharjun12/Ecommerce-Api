import express from "express";
import auth from "../middlewares/Auth.js";
import {
  captureRazorpayPayment,
  captureStripePayment,
  sendRazorpayKey,
  sendStripeKey,
} from "../controllers/PaymentController.js";

const paymentRoute = express.Router();

//define routes

//keys
paymentRoute.get("/stripekey", auth, sendStripeKey);
paymentRoute.get("/razorpaykey", auth, sendRazorpayKey);

//capture payments
paymentRoute.post("/stripepayment", auth, captureStripePayment);
paymentRoute.post("/razorpaypayment", auth, captureRazorpayPayment);

export default paymentRoute;
