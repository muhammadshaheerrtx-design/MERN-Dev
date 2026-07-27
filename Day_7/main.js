import { products } from "./data.js";
import {
  createTracker,
  searchProducts,
  sortProductsBy,
  getInventorySummary,
  groupByCategory,
  simulateCategoryDiscount,
  getSupplierAudit,
} from "./transforms.js";
import { Cart } from "./class.js";

const logSection = createTracker();

function runEngine() {
  console.clear();
  console.log("=".repeat(50));
  console.log("        E-COMMERCE PRODUCT & INVENTORY ENGINE              ");
  console.log("=".repeat(50));

  console.log(logSection("Inventory Metrics Overview"));
  console.table([getInventorySummary(products)]);

  console.log(logSection("Category Breakdown Stats"));
  console.table(groupByCategory(products));

  console.log(logSection('Search Query: Keyword = "tech", Price = $20 - $150'));
  const searchResults = searchProducts(products, {
    keyword: "tech",
    minPrice: 20,
    maxPrice: 150,
  });
  console.table(
    searchResults.map(({ name, category, price, stock, rating }) => ({
      name,
      category,
      price: `$${price}`,
      stock,
      rating,
    })),
  );

  console.log(logSection("Sorted by Price (Highest to Lowest)"));
  const sortedByPrice = sortProductsBy(products, "price", false).slice(0, 5);
  console.table(
    sortedByPrice.map(({ name, category, price, stock }) => ({
      name,
      category,
      price: `$${price}`,
      stock,
    })),
  );

  console.log(logSection("Out of Stock Alerts"));
  const outOfStock = products.filter(({ stock }) => stock === 0);
  console.table(
    outOfStock.map(({ name, category, rating }) => ({
      name,
      category,
      rating,
    })),
  );

  console.log(logSection("Promotion Simulator: 15% OFF Electronics"));
  const promoResult = simulateCategoryDiscount(products, "Electronics", 15);
  console.log(
    `Total Customer Savings Potential: ${promoResult.totalSavingsFormatted}`,
  );

  const discountedElectronics = promoResult.updatedProducts
    .filter(({ category }) => category === "Electronics")
    .map(({ name, originalPrice, price }) => ({
      name,
      originalPrice: `$${originalPrice}`,
      discountedPrice: `$${price}`,
    }));
  console.table(discountedElectronics);

  console.log(logSection("Supplier Metadata Audit (Sample 5)"));
  console.table(getSupplierAudit(products).slice(0, 5));

  // quick demo of the Cart class using real product data
  console.log(logSection("Cart Demo"));
  const cart = new Cart();
  const mouse = products.find((p) => p.id === "p01");
  const ssd = products.find((p) => p.id === "p13");

  cart.addItem(mouse, 2).addItem(ssd, 1);
  console.table(cart.getReceipt());
  console.log(`Items in cart: ${cart.getItemCount()}`);
  console.log(`Subtotal: $${cart.getSubtotal().toFixed(2)}`);
  console.log("With 10% discount:", cart.applyDiscount(10));
}

runEngine();
