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

const {
  validateProductBody,
  validateProductPatchBody,
  validateIdParam,
} = require("../middleware/validateProduct");

router.route("/").get(getAllProducts).post(validateProductBody, createProduct);

router
  .route("/:id")
  .get(validateIdParam, getProductById)
  .put(validateIdParam, validateProductBody, replaceProduct)
  .patch(validateIdParam, validateProductPatchBody, updateProduct)
  .delete(validateIdParam, deleteProduct);

module.exports = router;
