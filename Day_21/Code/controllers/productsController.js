const db = require("../data/products");

function getAllProducts(req, res) {
  const { category } = req.query;

  let result = db.getAll();

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
}

function getProductById(req, res, next) {
  const id = Number(req.params.id);
  const product = db.getById(id);

  if (!product) {
    const error = new Error(`Product ${id} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, data: product });
}

function createProduct(req, res) {
  const { name, price, category } = req.body;
  const newProduct = db.create({ name, price, category });
  res.status(201).json({ success: true, data: newProduct });
}

function replaceProduct(req, res, next) {
  const id = Number(req.params.id);
  const { name, price, category } = req.body;

  const updated = db.replace(id, { name, price, category });

  if (!updated) {
    const error = new Error(`Product ${id} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, data: updated });
}

function updateProduct(req, res, next) {
  const id = Number(req.params.id);
  const updated = db.update(id, req.body);

  if (!updated) {
    const error = new Error(`Product ${id} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, data: updated });
}

function deleteProduct(req, res, next) {
  const id = Number(req.params.id);
  const deleted = db.remove(id);

  if (!deleted) {
    const error = new Error(`Product ${id} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, message: `Product ${id} deleted` });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
