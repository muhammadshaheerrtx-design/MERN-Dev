// Centralized error-handling middleware.
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
