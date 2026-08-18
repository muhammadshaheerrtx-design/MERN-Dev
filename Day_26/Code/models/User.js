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
      unique: true, // creates a unique index — no two users can share an email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "must be a valid email address"],
    },
    bio: {
      type: String,
      default: "", // default value applied if the field is omitted
      maxlength: [280, "bio cannot exceed 280 characters"],
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
