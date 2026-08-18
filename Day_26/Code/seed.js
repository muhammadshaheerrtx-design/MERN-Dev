require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("./models/User");
const Post = require("./models/Post");

async function seed() {
  await connectDB();

  console.log("\n--- Clearing old data ---");
  await Post.deleteMany({});
  await User.deleteMany({});

  console.log("\n--- Creating users ---");
  const [ali, sara, bilal] = await User.create([
    { name: "Ali Raza", email: "ali@example.com", bio: "Backend developer" },
    {
      name: "Sara Khan",
      email: "sara@example.com",
      bio: "Full stack engineer",
    },
    { name: "Bilal Ahmed", email: "bilal@example.com" }, // bio omitted
  ]);
  console.log(`Created ${3} users`);

  console.log("\n--- Creating posts (each references a user via ObjectId) ---");
  await Post.create([
    {
      title: "Getting started with Express",
      body: "Express makes building APIs in Node straightforward...",
      published: true,
      tags: ["express", "node"],
      author: ali._id, //this is the reference
    },
    {
      title: "Understanding Mongoose schemas",
      body: "A schema defines the shape of documents in a collection...",
      published: true,
      tags: ["mongoose", "mongodb"],
      author: ali._id,
    },
    {
      title: "Draft: thoughts on REST vs GraphQL",
      body: "Still working through this one...",
      published: false,
      tags: ["rest", "graphql"],
      author: sara._id,
    },
    {
      title: "Why I switched to Atlas",
      body: "Managed MongoDB removes a lot of ops overhead...",
      published: true,
      tags: ["mongodb", "atlas"],
      author: sara._id,
    },
    {
      title: "First post!",
      body: "Just getting started with this blog.",
      published: true,
      tags: ["intro"],
      author: bilal._id,
    },
  ]);
  console.log("Created 5 posts");

  await disconnectDB();
  console.log("\nSeed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
