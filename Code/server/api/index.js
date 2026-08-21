require("dotenv").config();

const app = require("../app");

// This is the ONLY file Vercel actually runs. Anything inside an /api
// folder is automatically treated as a serverless function — Vercel
// calls this exported Express app directly as the request handler for
// every incoming request, instead of you calling app.listen() yourself.
module.exports = app;
