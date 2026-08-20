const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true, // enforced at the DB level via a unique index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "must be a valid email address"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // excluded from query results by default — must opt in with .select("+passwordHash")
    },
  },
  { timestamps: true }
);

// Strip passwordHash (and Mongoose's internal __v) whenever a document
// is converted to JSON — this is what runs automatically when Express
// calls res.json() on a Mongoose document, so the hash can never
// accidentally leak in an API response even if someone forgets toPublic().
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
