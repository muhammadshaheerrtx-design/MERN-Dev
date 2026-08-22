const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

function signToken(user) {
  // Keep the token payload minimal — id is enough to look the user up later.
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = User.findByEmail(email);
    if (existing) {
      return sendError(res, 400, "An account with this email already exists");
    }

    // Never store the plain password — always hash before saving.
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({ name, email, passwordHash });

    const token = signToken(user);

    sendSuccess(res, 201, { user: User.toPublic(user), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = User.findByEmail(email);
    if (!user) {
      // Same error for "no such user" and "wrong password" — don't leak
      // which one it was, that's a minor security best practice.
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = signToken(user);

    sendSuccess(res, 200, { user: User.toPublic(user), token });
  } catch (err) {
    next(err);
  }
}

function me(req, res) {
  // req.user is set by the requireAuth middleware after verifying the JWT.
  sendSuccess(res, 200, { user: User.toPublic(req.user) });
}

module.exports = { register, login, me };
