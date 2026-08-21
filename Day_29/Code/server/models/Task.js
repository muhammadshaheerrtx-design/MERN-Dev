const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "done"],
        message: "status must be one of: pending, in-progress, done",
      },
      default: "pending",
    },
    // The relationship — every task belongs to exactly one user. This is
    // what lets us scope every query to req.user.id, same idea as Day 26.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Speeds up the most common query pattern: "give me all tasks for this user"
taskSchema.index({ user: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
