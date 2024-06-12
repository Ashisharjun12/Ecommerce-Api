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
  "/signUp",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  SignUp
);
userRoute.post("/login", login);
userRoute.get("/logout", logout);
userRoute.post("/forgotpassword", forgotPassword);
userRoute.post("/password/reset/:token", resetpassword);
userRoute.get("/userdashboard", auth, getloggedInUserDetails);
userRoute.post("/password/update", auth, changepassword);
userRoute.post(
  "/userdashboard/update",
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
userRoute.get('/admin/users' , auth, customrole('admin'),adminAllUser)
userRoute.get('/admin/user/:id' , auth , customrole('admin') , admingetOneUser)
userRoute.put('/admin/user/:id' ,auth , customrole('admin') ,adminupdateOneUser)
userRoute.delete('/admin/user/:id' , auth , customrole('admin') , adminDeleteOneUser)







//manager routes
userRoute.get('/manager/users' , auth, customrole('manager'),managerAllUser)


export default userRoute;
