const { sendError } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  const statusCode = err.statusCode || 500;
  sendError(res, statusCode, err.message || "Internal server error");
}

module.exports = errorHandler;
