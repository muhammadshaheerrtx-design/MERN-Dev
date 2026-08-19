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
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 27 Tasks API — now backed by MongoDB Atlas",
    endpoints: { auth: "/api/auth", tasks: "/api/tasks" },
  });
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
