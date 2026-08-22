require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// This file only runs when you do `node server.js` / `npm run dev`
// locally. Vercel never executes this file — it imports app.js directly
// through api/index.js instead, since a serverless function isn't
// allowed to call app.listen() and hold a port open.
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT} (${process.env.NODE_ENV || "development"} mode)`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB. Server not started.");
    console.error(err.message);
    process.exit(1);
  }
}

start();
