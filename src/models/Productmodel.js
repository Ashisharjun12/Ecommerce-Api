import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "please provide price"],
    },
    description: {
      type: String,
      required: [true, "please provide product desccription"],
    },
    photos: [
      {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "please select category"],
      enum: {
        values: ["short-sleves", "long-sleves", "hoodies", "shirts", "pants"], // error when i select short-sleves and long-sleves fix that in future
        message: "please select categores from enums",
      },
    },
    brand: {
      type: String,
      required: [true, "please provide a brand"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    NumberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const productmodel = mongoose.model("Product", productSchema);

export default productmodel;
