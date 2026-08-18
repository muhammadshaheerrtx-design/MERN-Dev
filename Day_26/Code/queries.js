require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("./models/User");
const Post = require("./models/Post");

async function run() {
  await connectDB();

  // FILTER — only published posts
  console.log("\n--- FILTER: published posts only ---");
  const publishedPosts = await Post.find({ published: true });
  publishedPosts.forEach((p) => console.log(`  - ${p.title}`));

  // FILTER — posts with a specific tag (querying inside an array field)
  console.log("\n--- FILTER: posts tagged 'mongodb' ---");
  const mongoPosts = await Post.find({ tags: "mongodb" });
  mongoPosts.forEach((p) => console.log(`  - ${p.title}`));

  // SORT — newest posts first
  console.log("\n--- SORT: all posts, newest first ---");
  const newestFirst = await Post.find().sort({ createdAt: -1 });
  newestFirst.forEach((p) =>
    console.log(`  - ${p.title} (${p.createdAt.toISOString()})`),
  );

  // LIMIT — just the 2 most recent posts
  console.log("\n--- LIMIT: 2 most recent posts ---");
  const latestTwo = await Post.find().sort({ createdAt: -1 }).limit(2);
  latestTwo.forEach((p) => console.log(`  - ${p.title}`));

  // PROJECTION — only return specific fields (title only, no body/tags)
  console.log("\n--- PROJECTION: titles only ---");
  const titlesOnly = await Post.find({}, "title published"); // 2nd arg = projection
  titlesOnly.forEach((p) =>
    console.log(`  - ${p.title} (published: ${p.published})`),
  );

  // POPULATE — replace the author ObjectId with the actual User document.
  console.log("\n--- POPULATE: posts with author details ---");
  const postsWithAuthors = await Post.find({ published: true })
    .populate("author", "name email") // only pull name + email from User
    .sort({ createdAt: -1 });

  postsWithAuthors.forEach((p) => {
    console.log(`  - "${p.title}" by ${p.author.name} (${p.author.email})`);
  });

  // COMBINED — filter + sort + limit + populate together
  console.log("\n--- COMBINED: latest 3 published posts, with author ---");
  const combined = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("author", "name");

  combined.forEach((p) => console.log(`  - ${p.title} — ${p.author.name}`));

  // REVERSE DIRECTION — find all posts belonging to one specific user.
  console.log("\n--- Posts by a specific user (Ali) ---");
  const ali = await User.findOne({ email: "ali@example.com" });
  const alisPosts = await Post.find({ author: ali._id }).select(
    "title published",
  );
  alisPosts.forEach((p) =>
    console.log(`  - ${p.title} (published: ${p.published})`),
  );

  // VALIDATION DEMO — invalid post/user
  console.log("\n--- VALIDATION: attempting to create an invalid post ---");
  try {
    await Post.create({ title: "Missing required fields" }); // no body, no author
  } catch (err) {
    console.log(`  Rejected as expected: ${err.message}`);
  }

  console.log("\n--- VALIDATION: attempting a duplicate email ---");
  try {
    await User.create({ name: "Duplicate Ali", email: "ali@example.com" });
  } catch (err) {
    console.log(`  Rejected as expected: ${err.message}`);
  }

  await disconnectDB();
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
