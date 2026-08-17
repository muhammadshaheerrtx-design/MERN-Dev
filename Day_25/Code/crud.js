require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const Product = require("./models/Product");

async function run() {
  await connectDB();

  // ------------------------------------------------------------------
  // CREATE — insert several documents
  // ------------------------------------------------------------------
  console.log("\n--- CREATE ---");

  // Clear out any leftover data from a previous run, so this script is
  // safe to re-run repeatedly for testing.
  await Product.deleteMany({});

  const created = await Product.insertMany([
    { name: "Wireless Mouse", price: 1500, category: "electronics" },
    { name: "Mechanical Keyboard", price: 6500, category: "electronics" },
    { name: "Notebook", price: 150, category: "stationery" },
    { name: "Desk Lamp", price: 2200, category: "home" },
  ]);
  console.log(`Inserted ${created.length} products`);
  created.forEach((p) => console.log(`  - ${p.name} (${p._id})`));

  // ------------------------------------------------------------------
  // READ — find all, and find with a filter
  // ------------------------------------------------------------------
  console.log("\n--- READ (all products) ---");
  const allProducts = await Product.find();
  console.log(`Found ${allProducts.length} total products`);

  console.log("\n--- READ (filtered: category = electronics) ---");
  const electronics = await Product.find({ category: "electronics" });
  electronics.forEach((p) => console.log(`  - ${p.name}: Rs. ${p.price}`));

  console.log("\n--- READ (single document by name) ---");
  const notebook = await Product.findOne({ name: "Notebook" });
  console.log(notebook);

  // ------------------------------------------------------------------
  // UPDATE — modify a document
  // ------------------------------------------------------------------
  console.log("\n--- UPDATE ---");
  const updated = await Product.findOneAndUpdate(
    { name: "Notebook" },
    { $set: { price: 200, inStock: true } },
    { new: true } // return the document AFTER the update, not before
  );
  console.log("Updated Notebook:", updated);

  // ------------------------------------------------------------------
  // DELETE — remove a document
  // ------------------------------------------------------------------
  console.log("\n--- DELETE ---");
  const deleteResult = await Product.deleteOne({ name: "Desk Lamp" });
  console.log(`Deleted ${deleteResult.deletedCount} document(s)`);

  // ------------------------------------------------------------------
  // Final state check
  // ------------------------------------------------------------------
  console.log("\n--- FINAL STATE ---");
  const remaining = await Product.find().sort({ price: 1 });
  remaining.forEach((p) =>
    console.log(`  - ${p.name}: Rs. ${p.price} (${p.category})`)
  );

  await disconnectDB();
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
