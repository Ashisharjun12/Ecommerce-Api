import createHttpError from "http-errors";
import Usermodel from "../models/Usermodel.js";
import cookieToken from "../utils/cookieToken.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import emailHelper from "../utils/emailHelper.js";
import crypto from "crypto";

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

const login = async (req, res, next) => {
  try {
    // Get data
    let { email, password } = req.body;

    //convert into string
    email = String(email);
    password = String(password);

    if (!email || !password) {
      return next(createHttpError(401, "Email or password required"));
    }

    // Find user in db and select the password field
    const user = await Usermodel.findOne({ email }).select("+password");

    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Debugging: Check if method exists on user object
    console.log("User Object:", user);
    console.log("isValidatedPassword Method:", typeof user.isValidatedPassword);

    // Ensure password is a string
    if (typeof password !== "string" || typeof user.password !== "string") {
      return next(createHttpError(400, "Invalid password format."));
    }

    // Validate password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return next(createHttpError(401, "Wrong password."));
    }

    // Send token
    cookieToken(user, res);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpONly: true,
  });

  res.status(200).json({
    success: true,
    msg: "logout successfully",
  });
};

const forgotPassword = async (req, res, next) => {
  //get data
  const { email } = req.body;

  const user = await Usermodel.findOne({ email });

  if (!user) {
    return next(createHttpError(400, "email not found"));
  }

  const forgotToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myurl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${forgotToken}`;

  const message = `copy and paste email in new tab \n\n ${myurl}`;

  //shoot the email

  try {
    await emailHelper({
      email: user.email,
      subject: "password reset email",
      message,
    });

    res.status(200).json({
      success: true,
      mesg: "email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(createHttpError(500, error.message));
  }
};

const resetpassword = async (req, res, next) => {
  //get data
  const { password, confirmpassword } = req.body;
  const token = req.params.token;

  //encrypt token
  const encrToken = crypto.createHash("sha256").update(token).digest("hex");

  //find in db
  const user = await Usermodel.findOne({
    forgotPasswordToken: encrToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  console.log("User Found:", user);

  //check
  if (!user) {
    return next(createHttpError(400, "token is Invalid or Expired"));
  }

  //check confirm password

  if (password !== confirmpassword) {
    return next(createHttpError(400, "please match the password"));
  }

  //save password in db

  user.password = password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  //send json or token

  cookieToken(user, res);
};

const getloggedInUserDetails = async (req, res, next) => {
  const user = await Usermodel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

const changepassword = async (req, res, next) => {
  //get data

  let { oldpassword, newpassword } = req.body;
  let userId = req.user.id;

  //convert into string
  oldpassword = String(oldpassword);
  newpassword = String(newpassword);
  userId = String(userId);

  const user = await Usermodel.findById(userId).select("+password");

  const isCorrectOldPassword = await user.isValidatedPassword(oldpassword);

  if (!isCorrectOldPassword) {
    return next(createHttpError(400, "old password is incorrect"));
  }

  user.password = newpassword;

  await user.save();

  cookieToken(user, res);
};

const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { firstname, lastname, email } = req.body;

    // Handle file upload
    let photoLocalPath;
    if (req.files && req.files.photo) {
      photoLocalPath = req.files.photo[0].path;
    }

    const newData = {
      firstname,
      lastname,
      email,
    };

    // If a new photo is uploaded
    if (photoLocalPath) {
      const user = await Usermodel.findById(userId);

      if (!user) {
        return next(createHttpError(404, "User not found"));
      }

      // If the user already has a photo, delete it from Cloudinary
      if (user.photo && user.photo.id) {
        await deleteOnCloudinary(user.photo.id);
      }

      // Upload the new photo to Cloudinary
      const photoUpload = await uploadOnCloudinary(
        photoLocalPath,
        "userfolder"
      );

      // Update the photo data in newData object
      newData.photo = {
        id: photoUpload.public_id,
        secure_url: photoUpload.secure_url,
      };
    }

    // Update the user details in the database
    const updatedUser = await Usermodel.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//admin controllers

const adminAllUser = async (req, res, next) => {
  const users = await Usermodel.find();

  res.status(200).json({
    success: true,
    users,
  });
};

const admingetOneUser = async (req, res, next) => {
  const userId = req.params.id;

  const user = await Usermodel.findById(userId);

  if (!user) {
    return next(createHttpError(401, "user not found"));
  }

  res.status(200).json({
    success: true,
    user,
  });
};

const adminupdateOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const { firstname, lastname, email, role } = req.body;

    const newData = {
      firstname,
      lastname,
      email,
      role,
    };

    // Update the user details in the database
    const updatedUser = await Usermodel.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const adminDeleteOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await Usermodel.findById(userId);

    if (!user) {
      return next(createHttpError(404, "No such user found"));
    }

    // Delete photo on Cloudinary
    if (user.photo && user.photo.id) {
      const imageId = user.photo.id;
      await deleteOnCloudinary(imageId);
    }

    // Remove user from database
    await Usermodel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//manger
const managerAllUser = async (req, res, next) => {
  const users = await Usermodel.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
};

export {
  SignUp,
  login,
  logout,
  forgotPassword,
  resetpassword,
  getloggedInUserDetails,
  changepassword,
  updateUserDetails,
  adminAllUser,
  admingetOneUser,
  adminupdateOneUser,
  adminDeleteOneUser,
  managerAllUser,
};
