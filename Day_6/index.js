/**
 * DAY 6 Product & Inventory Insight
 * - File reading & JSON parsing
 * - Functions & Guard clauses
 * - Closures & Private scope
 * - Array Higher-Order Methods (map, filter, reduce, sort) & Immutability
 * - Object Destructuring, Spread, Optional Chaining (?.), Nullish Coalescing (??)
 */

const fs = require("fs");
const path = require("path");

// 1. DATA LOADING
const rawData = fs.readFileSync(path.join(__dirname, "products.json"), "utf-8");
const products = JSON.parse(rawData);

// 2. STATEFUL CLOSURE TOOL
const createTracker = () => {
  let count = 0;
  return (title) => {
    count++;
    return `\n=== [INSIGHT #${count}] ${title.toUpperCase()} ===`;
  };
};

const logSection = createTracker();

// 3. PURE & SYNCHRONOUS CORE FUNCTIONS

//Search Engine
const searchProducts = (dataset, query = {}) => {
  const {
    keyword = "",
    category = "All",
    minPrice = 0,
    maxPrice = Infinity,
  } = query;
  const term = keyword.toLowerCase().trim();

  return dataset.filter((product) => {
    const matchesCategory =
      category === "All" ||
      product.category.toLowerCase() === category.toLowerCase();
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    // Check name or tags array using array methods
    const matchesKeyword =
      !term ||
      product.name.toLowerCase().includes(term) ||
      (product.tags &&
        product.tags.some((tag) => tag.toLowerCase().includes(term)));

    return matchesCategory && matchesPrice && matchesKeyword;
  });
};

/**
 * Sorting Array
 */
const sortProductsBy = (dataset, key = "price", isAscending = true) => {
  const direction = isAscending ? 1 : -1;

  // Pure copy using spread operator [...]
  return [...dataset].sort((a, b) => {
    const valA = a[key] ?? "";
    const valB = b[key] ?? "";

    if (typeof valA === "string") {
      return valA.localeCompare(valB) * direction;
    }
    return (valA - valB) * direction;
  });
};

/**
 * Calculate Overall Inventory Metrics
 */
const getInventorySummary = (dataset) => {
  const initialStats = { totalValue: 0, totalUnits: 0 };

  const { totalValue, totalUnits } = dataset.reduce(
    (acc, { price, stock }) => ({
      totalValue: acc.totalValue + price * stock,
      totalUnits: acc.totalUnits + stock,
    }),
    initialStats,
  );

  const averagePrice =
    dataset.reduce((sum, { price }) => sum + price, 0) / (dataset.length || 1);

  return {
    totalProducts: dataset.length,
    totalUnits,
    averagePrice: `$${averagePrice.toFixed(2)}`,
    totalValuation: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
};

/**
 * Group Products by Category (Day 4 & Day 5: Reduce + Nullish Coalescing)
 */
const groupByCategory = (dataset) => {
  return dataset.reduce((acc, { category, price, stock }) => {
    const current = acc[category] ?? { count: 0, totalStock: 0, valuation: 0 };

    return {
      ...acc,
      [category]: {
        count: current.count + 1,
        totalStock: current.totalStock + stock,
        valuation: Number((current.valuation + price * stock).toFixed(2)),
      },
    };
  }, {});
};

//Discount Simulator for a Target Category
const simulateCategoryDiscount = (dataset, targetCategory, percentage) => {
  const factor = 1 - percentage / 100;

  // Immutably create updated product list using .map()
  const updatedProducts = dataset.map((product) => {
    if (product.category.toLowerCase() !== targetCategory.toLowerCase()) {
      return product;
    }

    return {
      ...product,
      originalPrice: product.price,
      price: Number((product.price * factor).toFixed(2)),
    };
  });

  // Calculate total potential customer savings
  const totalSavings = dataset.reduce((acc, { category, price, stock }) => {
    if (category.toLowerCase() === targetCategory.toLowerCase()) {
      return acc + price * (percentage / 100) * stock;
    }
    return acc;
  }, 0);

  return {
    updatedProducts,
    totalSavingsFormatted: `$${totalSavings.toFixed(2)}`,
  };
};

/**
 * Extract Supplier Audit with Defensive Fallbacks (Day 5: Optional Chaining)
 */
const getSupplierAudit = (dataset) => {
  return dataset.map(({ name, supplier }) => ({
    productName: name,
    // Optional chaining (?.) and Nullish coalescing (??) fallback
    supplier: supplier?.name ?? "Direct Manufacturer",
    country: supplier?.country ?? "N/A",
  }));
};

// 4. MAIN EXECUTION & REPORTING ENGINE
function runEngine() {
  console.clear();
  console.log("=".repeat(50));
  console.log("        E-COMMERCE PRODUCT & INVENTORY ENGINE              ");
  console.log("=".repeat(50));
  // 1. Overall Metrics
  console.log(logSection("Inventory Metrics Overview"));
  console.table([getInventorySummary(products)]);

  // 2. Category Breakdown
  console.log(logSection("Category Breakdown Stats"));
  console.table(groupByCategory(products));

  // 3. Search Engine Test
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

  // 4. Dynamic Sorting Test
  console.log(logSection("Sorted by Price (Highest to Lowest)"));
  const sortedByPrice = sortProductsBy(products, "price", false).slice(0, 5); // Top 5
  console.table(
    sortedByPrice.map(({ name, category, price, stock }) => ({
      name,
      category,
      price: `$${price}`,
      stock,
    })),
  );

  // 5. Out of Stock Alerts
  console.log(logSection("Out of Stock Alerts"));
  const outOfStock = products.filter(({ stock }) => stock === 0);
  console.table(
    outOfStock.map(({ name, category, rating }) => ({
      name,
      category,
      rating,
    })),
  );

  // 6. Discount Formulations
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

  // 7. Supplier Audit
  console.log(logSection("Supplier Metadata Audit (Sample 5)"));
  console.table(getSupplierAudit(products).slice(0, 5));
}

// Execute the synchronous engine
runEngine();
