const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

async function disconnectDB() {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

module.exports = { connectDB, disconnectDB };
