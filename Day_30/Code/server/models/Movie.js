const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["to-watch", "watched"],
        message: "status must be one of: to-watch, watched",
      },
      default: "to-watch",
    },
    rating: {
      type: Number,
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
      default: null, // no rating until it's actually been watched
    },
    notes: {
      type: String,
      default: "",
    },
    // The relationship — every movie entry belongs to exactly one user.
    // Same pattern as Task.user from the Tasks app.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Speeds up the most common query: "give me all movies for this user"
movieSchema.index({ user: 1 });

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
