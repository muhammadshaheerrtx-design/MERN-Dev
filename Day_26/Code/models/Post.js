const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "body is required"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    // This is the REFERENCE that creates the relationship. We store only
    // the related User's _id here (not the whole user document) — this is
    // "referenced" data, as opposed to "embedded" data where the full
    // user object would be copied directly into every post.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // tells Mongoose which model populate() should look in
      required: [true, "author is required"],
    },
  },
  {
    timestamps: true,
  }
);

// An index speeds up queries that filter/sort by this field. Since we
// constantly query posts "by author", this index avoids a full collection
// scan every time — the concept the task asks us to be aware of.
postSchema.index({ author: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
