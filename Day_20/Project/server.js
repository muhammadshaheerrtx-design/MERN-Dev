const express = require("express");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

// Needed to read JSON request bodies (req.body) for POST/PUT/PATCH
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 20 REST CRUD API is running",
    resource: "/api/products",
  });
});

// All /api/products/* requests are handled by the products router
app.use("/api/products", productsRouter);

// 404 for anything unmatched
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Centralized error handler (last in the stack)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
