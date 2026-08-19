const { sendError } = require("../utils/response");

// Centralized error handler — now also translates common Mongoose/MongoDB
// error types into clean, specific responses instead of letting them fall
// through as raw 500s with confusing internal error messages.
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.name, "-", err.message);

  // Mongoose schema validation failed (e.g. missing required field,
  // bad enum value) — thrown by .create() / .save() / runValidators.
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, "Validation failed", details);
  }

  // Mongoose couldn't cast a value to the expected type — most commonly
  // an invalid ObjectId string passed where one was expected.
  if (err.name === "CastError") {
    return sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  // MongoDB duplicate key error (e.g. unique email already exists) —
  // this can still occur here as a race-condition backstop even though
  // the controller also checks proactively before inserting.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return sendError(res, 400, `${field} already in use`);
  }

  const statusCode = err.statusCode || 500;
  sendError(res, statusCode, err.message || "Internal server error");
}

module.exports = errorHandler;
