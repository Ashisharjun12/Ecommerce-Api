import express from "express";
import { adminDeleteOrder, adminUpdateOrder, admingetAllOrders, createOrder, getOneOrder, loggedInOrder } from "../controllers/OrderController.js";
import auth from "../middlewares/Auth.js";
import customRole from "../middlewares/CustomRole.js";
const orderRoute = express.Router();

//define routes
orderRoute.post("/order/create", auth, createOrder);
orderRoute.get("/order/:id", auth, getOneOrder);
orderRoute.get('/myorder' , auth , loggedInOrder)


//admin routes
orderRoute.get('/admin/orders' , auth , customRole('admin') , admingetAllOrders)
orderRoute.put('/admin/order/:id', auth , customRole('admin') , adminUpdateOrder)
orderRoute.delete('/admin/order/:id', auth,customRole('admin'), adminDeleteOrder)

export default orderRoute;
