require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));

app.use(express.json());

app.use(requestLogger);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 21 hardened API is running",
    resource: "/api/products",
  });
});

app.use("/api/products", productsRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server listening on http://localhost:${PORT} (${process.env.NODE_ENV || "development"} mode)`,
  );
});
