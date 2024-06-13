import express from "express";
import {
  SignUp,
  adminAllUser,
  adminDeleteOneUser,
  admingetOneUser,
  adminupdateOneUser,
  changepassword,
  forgotPassword,
  getloggedInUserDetails,
  login,
  logout,
  managerAllUser,
  resetpassword,
  updateUserDetails,
} from "../controllers/UserController.js";
import { upload } from "../middlewares/multer.js";
import auth from "../middlewares/Auth.js";
import customrole from "../middlewares/CustomRole.js";

const userRoute = express.Router();

//define routes
userRoute.post(
  "/user/signUp",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  SignUp
);
userRoute.post("/user/login", login);
userRoute.get("/user/logout", logout);
userRoute.post("/user/forgotpassword", forgotPassword);
userRoute.post("/user/password/reset/:token", resetpassword);
userRoute.get("/user/userdashboard", auth, getloggedInUserDetails);
userRoute.post("/user/password/update", auth, changepassword);
userRoute.post(
  "/user/userdashboard/update",
  auth,
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  updateUserDetails
);

//admin routes
userRoute.get("/user/admin/users", auth, customrole("admin"), adminAllUser);
userRoute.get(
  "/user/admin/user/:id",
  auth,
  customrole("admin"),
  admingetOneUser
);
userRoute.put(
  "/user/admin/user/:id",
  auth,
  customrole("admin"),
  adminupdateOneUser
);
userRoute.delete(
  "/user/admin/user/:id",
  auth,
  customrole("admin"),
  adminDeleteOneUser
);

//manager routes
userRoute.get("/user/manager/users", auth, customrole("manager"), managerAllUser);

export default userRoute;
