import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { _config } from "../config/config.js";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "name is required"],
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password should be min 6 char"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

//hashed password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//validate password
UserSchema.methods.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

//crete and return jwt token
UserSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, _config.JWT_SECRET, { expiresIn: "12h" });
};

//generate forgotpassword token
UserSchema.methods.generateForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  //get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //set time
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

const Usermodel = mongoose.model("User", UserSchema);

export default Usermodel;
