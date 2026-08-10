const express = require("express");
const usersRouter = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON bodies (req.body) — built into Express 5
app.use(express.json());

// Small request logger so you can see the request lifecycle in your terminal
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------------------------------------------------
// Basic GET routes returning JSON
// ------------------------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 19 Express API is running",
    endpoints: {
      users: "/api/users",
      userById: "/api/users/:id",
      searchByRole: "/api/users?role=admin",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", uptime: process.uptime() });
});

// Mount the users router
app.use("/api/users", usersRouter);

// ------------------------------------------------------------------
// 404 handler — runs when no route above matched
// ------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ------------------------------------------------------------------
// Centralized error handler — runs if any route calls next(err)
// or throws synchronously. Keep this LAST.
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
