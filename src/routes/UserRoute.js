import express from "express";
import { SignUp } from "../controllers/UserController.js";
import { upload } from "../middlewares/multer.js";

const userRoute = express.Router();

//define routes
userRoute.post(
  "/signUp",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  SignUp
);

export default userRoute;
