const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // findOne is a real DB round trip now, not an array .find()
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 400, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // User.create() both validates against the schema AND persists to
    // Atlas in one call. If validation fails (e.g. bad email format),
    // Mongoose throws a ValidationError, caught below.
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user);

    // user.toJSON() (called automatically by res.json()) already strips
    // passwordHash via the schema transform — no manual toPublic() needed.
    sendSuccess(res, 201, { user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // passwordHash has `select: false` in the schema, so we must
    // explicitly request it here to be able to compare it.
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = signToken(user);

    sendSuccess(res, 200, { user, token });
  } catch (err) {
    next(err);
  }
}

function me(req, res) {
  // req.user is attached by requireAuth after verifying the JWT and
  // looking the user up in the database.
  sendSuccess(res, 200, { user: req.user });
}

module.exports = { register, login, me };
