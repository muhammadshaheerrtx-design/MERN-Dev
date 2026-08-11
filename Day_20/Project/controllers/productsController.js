// Controller: holds the actual handler logic.
// The router (routes/products.js) just maps HTTP verb + path to these functions.
// This split is the "structuring routes and controllers" part of today's task.

const db = require("../data/products");

// GET /api/products
// Also supports ?category= as a query param filter
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

// GET /api/products/:id
function getProductById(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ success: false, error: "id must be a number" });
  }

  const product = db.getById(id);

  if (!product) {
    return res.status(404).json({ success: false, error: `Product ${id} not found` });
  }

  res.status(200).json({ success: true, data: product });
}

// POST /api/products
function createProduct(req, res) {
  const { name, price, category } = req.body || {};

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      success: false,
      error: "name, price, and category are required",
    });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ success: false, error: "price must be a positive number" });
  }

  const newProduct = db.create({ name, price, category });
  res.status(201).json({ success: true, data: newProduct });
}

// PUT /api/products/:id  (full replace)
function replaceProduct(req, res) {
  const id = Number(req.params.id);
  const { name, price, category } = req.body || {};

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      success: false,
      error: "name, price, and category are required for a full replace",
    });
  }

  const updated = db.replace(id, { name, price, category });

  if (!updated) {
    return res.status(404).json({ success: false, error: `Product ${id} not found` });
  }

  res.status(200).json({ success: true, data: updated });
}

// PATCH /api/products/:id  (partial update)
function updateProduct(req, res) {
  const id = Number(req.params.id);
  const updates = req.body || {};

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, error: "No fields to update" });
  }

  const updated = db.update(id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, error: `Product ${id} not found` });
  }

  res.status(200).json({ success: true, data: updated });
}

// DELETE /api/products/:id
function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const deleted = db.remove(id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: `Product ${id} not found` });
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
