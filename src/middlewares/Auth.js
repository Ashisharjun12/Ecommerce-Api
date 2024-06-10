import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { _config } from "../config/config.js";

const auth = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(createHttpError(403, "token is missing"));
  }

  //verify token

  try {
    const decode = jwt.verify(token, _config.JWT_SECRET);
    console.log(decode);

    req.user = decode;
  } catch (error) {
    return next(createHttpError(401, "Invalid token"));
  }

  return next();
};

export default auth;
