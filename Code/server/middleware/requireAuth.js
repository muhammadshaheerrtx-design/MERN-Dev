const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;

// Now async, because verifying the user still exists means a real DB
// lookup, not a synchronous array scan like in the in-memory version.
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Missing or malformed Authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "User for this token no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token has expired, please log in again");
    }
    if (err.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token");
    }
    // Anything else (e.g. a DB connectivity issue during findById) is a
    // real unexpected error, not an auth failure — hand it to the
    // centralized error handler instead of masking it as a 401.
    next(err);
  }
}

module.exports = requireAuth;
