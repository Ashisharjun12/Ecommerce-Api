import express from "express";
import {
  addproduct,
  addreview,
  admindeleteOneProduct,
  admingetAllProducts,
  admingetUpdateOneProduct,
  deleteReview,
  getOneProduct,
  getOnlyReviewForOneProduct,
  getallProducts,
} from "../controllers/ProductController.js";
import { upload } from "../middlewares/multer.js";
import auth from "../middlewares/Auth.js";
import customrole from "../middlewares/CustomRole.js";

const productroute = express.Router();

//define routes

//user routes
productroute.get("/product/products", getallProducts);
productroute.get("/product/product/:productid", getOneProduct);
productroute.put("/product/review/:productid", auth, addreview);
productroute.delete("/product/review/:productid", auth, deleteReview);
productroute.get("/product/review/:productid", getOnlyReviewForOneProduct);

//admin routes
productroute.post(
  "/product/admin/product/add",
  auth,
  customrole("admin"),
  upload.fields([
    {
      name: "photos",
      maxCount: 7,
    },
  ]),
  addproduct
);
productroute.get(
  "/product/admin/products",
  auth,
  customrole("admin"),
  admingetAllProducts
);
productroute.post(
  "/product/admin/product/:productid",
  auth,
  customrole("admin"),
  upload.fields([
    {
      name: "photos",
      maxCount: 7,
    },
  ]),
  admingetUpdateOneProduct
);
productroute.delete(
  "/product/admin/product/:productid",
  auth,
  customrole("admin"),
  admindeleteOneProduct
);

export default productroute;
