const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;

// Protects a route: expects "Authorization: Bearer <token>".
// On success, attaches the full user record to req.user.
// On failure, responds with 401 and never calls next().
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Missing or malformed Authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "User for this token no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token has expired, please log in again");
    }
    return sendError(res, 401, "Invalid token");
  }
}

module.exports = requireAuth;
