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

const loggedInOrder = async (req, res, next) => {
  const order = await ordermodel.find({ user: req.user._id });

  if (!order) {
    return next(createHttpError("no order found by this Id ", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
};

//admin controllers
const admingetAllOrders = async (req, res, next) => {
  const orders = await ordermodel.find();

  res.status(200).json({
    success: true,
    orders,
  });
};

const adminUpdateOrder = async(req,res,next)=>{


  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    const order = await ordermodel.findById(orderId);

    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }

    if (order.orderStatus === 'Delivered') {
      return next(createHttpError(401, 'Order is already delivered'));
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    return next(createHttpError(500, 'Error updating order status'));
  }

}

const adminDeleteOrder = async(req,res,next)=>{

const orderId = req.params.id

const order = await ordermodel.findByIdAndDelete(orderId)

res.status(200).json({
  success:true,
  message:"order deleted successfully",
  order
})


}


export { createOrder, getOneOrder, loggedInOrder, admingetAllOrders , adminUpdateOrder , adminDeleteOrder};
