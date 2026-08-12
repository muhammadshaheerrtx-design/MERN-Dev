// Manual input validation middleware .
function validateProductBody(req, res, next) {
  const { name, price, category } = req.body || {};
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("name is required and must be a non-empty string");
  }

  if (price === undefined || price === null) {
    errors.push("price is required");
  } else if (typeof price !== "number" || Number.isNaN(price)) {
    errors.push("price must be a number");
  } else if (price < 0) {
    errors.push("price must be a positive number");
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    errors.push("category is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });
  }

  next();
}

function validateProductPatchBody(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Request body cannot be empty" });
  }

  if ("name" in body && (typeof body.name !== "string" || !body.name.trim())) {
    errors.push("name must be a non-empty string");
  }

  if ("price" in body) {
    if (typeof body.price !== "number" || Number.isNaN(body.price)) {
      errors.push("price must be a number");
    } else if (body.price < 0) {
      errors.push("price must be a positive number");
    }
  }

  if (
    "category" in body &&
    (typeof body.category !== "string" || !body.category.trim())
  ) {
    errors.push("category must be a non-empty string");
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });
  }

  next();
}

// Used for any route with :id — makes sure it's a valid number before
// the controller even tries to look it up.
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: "id must be a number" });
  }

  next();
}

module.exports = {
  validateProductBody,
  validateProductPatchBody,
  validateIdParam,
};
