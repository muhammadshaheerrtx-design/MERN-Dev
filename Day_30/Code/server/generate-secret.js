const crypto = require("crypto");

// 64 random bytes -> 128 hex characters. Long enough that brute-forcing
// the secret is computationally infeasible.
console.log(crypto.randomBytes(64).toString("hex"));
