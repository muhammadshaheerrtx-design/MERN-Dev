// Router: only maps HTTP method + path -> controller function.
// No business logic lives here (that's the controller's job).

const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// GET /api/products         -> list (optionally filtered by ?category=)
router.get("/", getAllProducts);

// GET /api/products/:id     -> read one
router.get("/:id", getProductById);

// POST /api/products        -> create
router.post("/", createProduct);

// PUT /api/products/:id      -> full update/replace
router.put("/:id", replaceProduct);

// PATCH /api/products/:id    -> partial update
router.patch("/:id", updateProduct);

// DELETE /api/products/:id   -> remove
router.delete("/:id", deleteProduct);

module.exports = router;
