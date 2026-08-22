const mongoose = require("mongoose");

// Serverless functions can be invoked many times per minute, each in a
// potentially fresh execution context. Without caching, every single
// request would call mongoose.connect() again, which is slow and can
// exhaust Atlas's connection limit very quickly under real traffic.
//
// The fix: stash the connection (and any in-flight connection promise)
// on the Node global object, which Vercel's runtime can reuse between
// invocations of the same warm function instance. This has no effect on
// local dev — it just means "connect once, reuse after that" there too.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // already connected on this warm instance — reuse it
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in .env");
    }

    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
