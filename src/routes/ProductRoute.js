import express from "express";
import { test } from "../controllers/ProductController.js";
const productroute = express.Router();

//define routes
productroute.get("/test", test);

export default productroute;
