
import { _config } from "../config/config.js";
import { nanoid } from "nanoid";
import { Stripe } from "stripe";

const stripe = new Stripe(_config.STRIPE_SECRET);

const sendStripeKey = () => {
  res.send(200).json({
    stripeKey: _config.STRIPE_API_KEY,
  });
};

const sendRazorpayKey = () => {
  res.send(200).json({
    stripeKey: _config.RAZORPAY_API_KEY,
  });
};

const captureStripePayment = async (req, res, next) => {
  const paymentIntent = stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    //optional
    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    amount:req.body.amount,
    client_secret: (await paymentIntent).client_secret,
  });
};

const captureRazorpayPayment = async (req,res,next)=>{

    var instance = new Razorpay({ key_id: _config.RAZORPAY_API_KEY, key_secret: _config.RAZORPAY_SECRET })

    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt:nanoid()+ "razorpay_recipt",
        

    }

const myorder = await instance.orders.create(options)

res.status(200).json({
    success:true,
    amount:req.body.amount,
    order:myorder
})


}

export { sendStripeKey, captureStripePayment, sendRazorpayKey ,captureRazorpayPayment};
