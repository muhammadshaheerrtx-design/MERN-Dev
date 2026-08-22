const { sendError } = require("../utils/response");

const VALID_STATUSES = ["to-watch", "watched"];

function validateMovieBody(req, res, next) {
  const { title, status, rating } = req.body || {};
  const errors = [];

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required and must be a non-empty string");
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (rating !== undefined && rating !== null) {
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      errors.push("rating must be a number between 1 and 5");
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, "Validation failed", errors);
  }

  next();
}

function validateMoviePatchBody(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (Object.keys(body).length === 0) {
    return sendError(res, 400, "Request body cannot be empty");
  }

  if ("title" in body && (typeof body.title !== "string" || !body.title.trim())) {
    errors.push("title must be a non-empty string");
  }

  if ("status" in body && !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if ("rating" in body && body.rating !== null) {
    if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
      errors.push("rating must be a number between 1 and 5");
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, "Validation failed", errors);
  }

  next();
}

module.exports = { validateMovieBody, validateMoviePatchBody };
