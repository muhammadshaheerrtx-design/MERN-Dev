const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
const authRouter = require("./routes/auth");
const moviesRouter = require("./routes/movies");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS_ORIGIN supports a comma-separated list, e.g.
// "http://localhost:5173,https://taskline.vercel.app"
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
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

// Ensures the database connection is ready before any route handler
// runs. connectDB() is cheap to call repeatedly — it reuses the cached
// connection (see db.js) rather than reconnecting every request, which
// is what makes this safe to run as middleware on every single request
// in a serverless environment.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movie Watchlist API",
    endpoints: { auth: "/api/auth", movies: "/api/movies" },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/movies", moviesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
