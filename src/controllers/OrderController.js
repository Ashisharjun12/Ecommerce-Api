import createHttpError from "http-errors";
import ordermodel from "../models/Ordermodel.js";

const createOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    const order = await ordermodel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(createHttpError(400, "error while creating order"));
  }
};

const getOneOrder = async (req, res, next) => {
  const orderId = req.params.id;

  const order = await ordermodel
    .findById(orderId)
    .populate("user", " firstname lastname email")
    .populate({
      path: "orderItems.product",
      model: "Product", // when you populate something give path and which model to populte the data
    });

  if (!order) {
    return next(createHttpError("no order found by this Id ", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
};

export { createOrder, getOneOrder };
