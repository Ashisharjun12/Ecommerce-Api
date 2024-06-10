import createHttpError from "http-errors";
import Usermodel from "../models/Usermodel.js";
import cookieToken from "../utils/cookieToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const SignUp = async (req, res, next) => {
  //get data
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !email || !password) {
    next(createHttpError(400, "All Fields required"));
  }

  // Handle file upload
  let photoLocalPath;
  if (req.files && req.files.photo) {
    photoLocalPath = req.files.photo[0].path;
  }

  if (!photoLocalPath) {
    return next(createHttpError(400, "Photo is required"));
  }

  // Upload photo to Cloudinary
  const photoupload = await uploadOnCloudinary(photoLocalPath, "userFolder");

  //call db

  const user = await Usermodel.create({
    firstname,
    lastname,
    email,
    password,
    photo: {
      id: photoupload.public_id,
      secure_url: photoupload.secure_url,
    },
  });

  cookieToken(user, res);
};

export { SignUp };
