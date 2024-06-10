import { config } from "dotenv";

config();

const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

export const _config = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
};
