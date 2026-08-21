const crypto = require("crypto");

// 64 random bytes -> 128 hex characters. Long enough that brute-forcing
// the secret is computationally infeasible, and hex output means it's
// always safe to paste directly into a .env file with no escaping issues.
const secret = crypto.randomBytes(64).toString("hex");

console.log(secret);
