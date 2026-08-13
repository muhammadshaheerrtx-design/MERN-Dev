const Product = require("../models/Product");
const { sendSuccess, sendError } = require("../utils/response");

function getAllProducts(req, res) {
  const { category } = req.query;
  const result = Product.findAll({ category });

  sendSuccess(res, 200, result, { count: result.length });
}

function getProductById(req, res) {
  const id = Number(req.params.id);
  const product = Product.findById(id);

  if (!product) {
    return sendError(res, 404, `Product ${id} not found`);
  }

  sendSuccess(res, 200, product);
}

function createProduct(req, res) {
  const { name, price, category } = req.body;
  const newProduct = Product.create({ name, price, category });

  sendSuccess(res, 201, newProduct);
}

function replaceProduct(req, res) {
  const id = Number(req.params.id);
  const { name, price, category } = req.body;

  const updated = Product.replaceById(id, { name, price, category });

  if (!updated) {
    return sendError(res, 404, `Product ${id} not found`);
  }

  sendSuccess(res, 200, updated);
}

function updateProduct(req, res) {
  const id = Number(req.params.id);
  const updated = Product.updateById(id, req.body);

  if (!updated) {
    return sendError(res, 404, `Product ${id} not found`);
  }

  sendSuccess(res, 200, updated);
}

function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const deleted = Product.deleteById(id);

  if (!deleted) {
    return sendError(res, 404, `Product ${id} not found`);
  }

  sendSuccess(res, 200, null, { message: `Product ${id} deleted` });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
