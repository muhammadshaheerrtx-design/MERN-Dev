require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
const authRouter = require("./routes/auth");
const tasksRouter = require("./routes/tasks");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// CORS_ORIGIN supports a comma-separated list, e.g.
// "http://localhost:5173,https://taskline.vercel.app"
// so the same server can accept requests from local dev AND the
// deployed front-end without needing separate config per environment.
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    // Requests with no Origin header (curl, Postman, server-to-server)
    // are always allowed — Origin is a browser-only concept.
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} is not allowed`));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Taskline API",
    endpoints: { auth: "/api/auth", tasks: "/api/tasks" },
  });
});

// Simple health check — useful for Render/uptime monitors, and for you
// to confirm the server has woken up after a free-tier cold start.
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use(notFound);
app.use(errorHandler);

// The server only starts listening AFTER a successful DB connection.
// This avoids the failure mode where the API looks "up" but every
// request would fail because it can't reach the database at all.
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
