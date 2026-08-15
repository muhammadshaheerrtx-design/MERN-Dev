const express = require("express");
const router = express.Router();

const { register, login, me } = require("../controllers/authController");
const { validateRegisterBody, validateLoginBody } = require("../middleware/validateAuth");
const requireAuth = require("../middleware/requireAuth");

router.post("/register", validateRegisterBody, register);
router.post("/login", validateLoginBody, login);

// The protected route required by today's task — only accessible with a
// valid JWT, proven by requireAuth running before the controller.
router.get("/me", requireAuth, me);

module.exports = router;
