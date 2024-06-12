import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { _config } from "../config/config.js";
import Usermodel from "../models/Usermodel.js";

const auth = async (req, res, next) => {
  // const token =
  //   req.cookies.token ||
  //   req.body.token ||
  //   req.header("Authorization").replace("Bearer ", "");

  // if (!token) {
  //   return next(createHttpError(403, "token is missing"));
  // }

  // //verify token

  // try {
  //   const decode = jwt.verify(token, _config.JWT_SECRET);
  //   console.log(decode);

  //   req.user = await Usermodel.findById(decode.id);
  // } catch (error) {
  //   return next(createHttpError(401, "Invalid token"));
  // }

  // return next();


  let token;

  // Debugging logs
  console.log("Cookies:", req.cookies);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  } else if (req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  // Debugging logs
  console.log("Extracted Token:", token);

  if (!token) {
    return next(createHttpError(403, "Token is missing"));
  }

  try {
    const decoded = jwt.verify(token, _config.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    req.user = await Usermodel.findById(decoded.id);
    if (!req.user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(createHttpError(401, "Invalid token"));
  }

  return next();
};

export default auth;
