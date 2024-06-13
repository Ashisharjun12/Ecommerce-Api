import createHttpError from "http-errors";
import productmodel from "../models/Productmodel.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import whereClause from "../utils/whereClause.js";

//user controller

const addproduct = async (req, res, next) => {
  try {
    // Get data
    const {
      name,
      price,
      description,
      category,
      brand,
      ratings,
      NumberOfReviews,
      reviews,
    } = req.body;

    // Validate category
    const validCategories = [
      "short-sleeves",
      "long-sleeves",
      "hoodies",
      "shirts",
      "pants",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category",
      });
    }

    // Get images
    let images = req.files.photos;

    let imageArray = [];

    if (images) {
      for (let index = 0; index < images.length; index++) {
        let result = await uploadOnCloudinary(images[index].path, "products");

        console.log(result);

        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    const product = await productmodel.create({
      name,
      price,
      description,
      category,
      brand,
      ratings,
      NumberOfReviews,
      reviews,
      user: req.user.id,
      photos: imageArray,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(createHttpError(400, "error while creating product data"));
  }
};

const getallProducts = async (req, res, next) => {
  try {
    const resultPerPage = 6;
    const totalProducts = await productmodel.countDocuments();

    const productsObj = new whereClause(productmodel.find({}), req.query)
      .search()
      .filter();

    // Apply pagination and execute the query once
    productsObj.pager(resultPerPage);
    const products = await productsObj.base;

    const filteredProductNumber = await productmodel.countDocuments(
      productsObj.base.getFilter()
    );

    res.status(200).json({
      success: true,
      products,
      filteredProductNumber,
      totalProducts,
    });
  } catch (error) {
    return next(createHttpError(401, "getting error while load products"));
  }
};

const getOneProduct = async (req, res, next) => {
  const productId = req.params.productid;

  const product = await productmodel.findById(productId);

  if (!product) {
    return next(createHttpError("this product not exist", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
};

const addreview = async (req, res, next) => {
  try {
    const productId = req.params.productid;
    const { rating, comment } = req.body;

    // Create a review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Find the product by ID
    const product = await productmodel.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update the existing review
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      // Add a new review
      product.reviews.push(review);
      product.NumberOfReviews = product.reviews.length;
    }

    // Calculate the average rating
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the product without validation errors
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return next(createHttpError(400, "error while adding review"));
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const productId = req.params.productid;

    // Find the product by ID
    const product = await productmodel.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Filter out the review of the logged-in user
    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() !== req.user._id.toString()
    );

    const numberOfReviews = reviews.length;

    // Calculate the average rating
    const ratings =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length || 0;

    // Update the product with the new reviews, ratings, and number of reviews
    await productmodel.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        NumberOfReviews: numberOfReviews,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return next(createHttpError(400, "error while delete review"));
  }
};

const getOnlyReviewForOneProduct = async (req, res, next) => {
  const product = await productmodel.findById(req.params.productid);

  res.status(200).json({
    success: true,
    review: product.reviews,
  });
};

//admin controller

const admingetAllProducts = async (req, res, next) => {
  const products = await productmodel.find({});

  if (!products) {
    return next(createHttpError("no products found", 404));
  }

  res.status(200).json({
    success: true,
    products,
  });
};

const admingetUpdateOneProduct = async (req, res, next) => {
  //getting product Id
  const productId = req.params.productid;

  //get data
  const {
    name,
    price,
    description,
    category,
    brand,
    ratings,
    NumberOfReviews,
    reviews,
  } = req.body;

  const product = await productmodel.findById(productId);

  if (!product) {
    return next(createHttpError("no product found by this ProductId", 401));
  }

  //images
  let imagesArray = [];

  //destroy images fromm cloudinary
  if (req.files) {
    for (let index = 0; index < product.photos.length; index++) {
      const response = await deleteOnCloudinary(product.photos[index].id);
    }

    //upload and save new images

    let images = req.files.photos;

    for (let index = 0; index < images.length; index++) {
      let result = await uploadOnCloudinary(images[index].path, "products");

      console.log(result);

      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  //update products

  const products = await productmodel.findByIdAndUpdate(
    productId,
    {
      name,
      price,
      description,
      category,
      brand,
      ratings,
      NumberOfReviews,
      reviews,
      photos: imagesArray,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    products,
  });
};

const admindeleteOneProduct = async (req, res, next) => {
  const productId = req.params.productid;

  const product = await productmodel.findById(productId);

  if (!product) {
    return next(createHttpError(404, "no product found by this ProductId"));
  }

  //delete from cloudinary
  for (let index = 0; index < product.photos.length; index++) {
    const response = await deleteOnCloudinary(product.photos[index].id);
  }

  const deleteProduct = await productmodel.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
};

export {
  addproduct,
  getallProducts,
  admingetAllProducts,
  getOneProduct,
  admingetUpdateOneProduct,
  admindeleteOneProduct,
  addreview,
  deleteReview,
  getOnlyReviewForOneProduct,
};
