const { sendError } = require("../utils/response");

const VALID_STATUSES = ["pending", "in-progress", "done"];

function validateTaskBody(req, res, next) {
  const { title, status } = req.body || {};
  const errors = [];

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required and must be a non-empty string");
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) {
    return sendError(res, 400, "Validation failed", errors);
  }

  next();
}

function validateTaskPatchBody(req, res, next) {
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

  if (errors.length > 0) {
    return sendError(res, 400, "Validation failed", errors);
  }

  next();
}

function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return sendError(res, 400, "id must be a number");
  }
  next();
}

module.exports = { validateTaskBody, validateTaskPatchBody, validateIdParam };
