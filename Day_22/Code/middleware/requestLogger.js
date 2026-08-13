// Custom logging middleware.

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // hand off to the next middleware/route handler
}

module.exports = requestLogger;
