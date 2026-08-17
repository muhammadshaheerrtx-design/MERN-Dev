const mongoose = require("mongoose");

// A Mongoose schema defines the SHAPE of a document — field names, types,
// and validation rules. Mongoose enforces this at the application level
// before anything is sent to MongoDB (MongoDB itself is schemaless).
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Adds createdAt / updatedAt fields automatically, managed by Mongoose.
    timestamps: true,
  }
);

// mongoose.model(name, schema) compiles the schema into a Model — the
// object you actually use to create/find/update/delete documents.
// Mongoose will store this in a collection called "products" (lowercased,
// pluralized automatically from "Product").
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
