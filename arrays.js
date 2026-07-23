const products = [
  { id: 1, name: "HairDryer", price: 25.99, inStock: true, qty: 40 },
  { id: 2, name: "Keyboard", price: 89.5, inStock: true, qty: 15 },
  { id: 3, name: "Type-C cable", price: 34, inStock: false, qty: 0 },
  { id: 4, name: "Monitor", price: 249, inStock: true, qty: 8 },
  { id: 5, name: "Laptop Stand", price: 14.3, inStock: true, qty: 60 },
  { id: 6, name: "Lamp", price: 45.0, inStock: false, qty: 0 },
  { id: 7, name: "Airpods", price: 129.99, inStock: true, qty: 12 },
  { id: 8, name: "Towels", price: 79.4, inStock: true, qty: 30 },
  { id: 9, name: "Bluetooth Speaker", price: 100, inStock: false, qty: 0 },
  { id: 10, name: "SSD 1TB", price: 99, inStock: true, qty: 20 },
  { id: 11, name: "Office Chair", price: 190, inStock: true, qty: 5 },
  { id: 12, name: "Airfryer", price: 10, inStock: true, qty: 100 },
];

function sortByPriceThenName(products) {
  let sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (a.price !== b.price) {
      return a.price - b.price;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return sortedProducts;
}

function isInStock(products) {
  const inStockProducts = [...products]
    .filter((product) => product.inStock)
    .map((product) => product.name);

  return inStockProducts;
}

function listName(products) {
  const productNames = products.map((product) => product.name);

  return productNames;
}

function totalInventoryValue(products) {
  let total = products.reduce(
    (total, product) => (total += product.price * product.qty),
    0,
  );
  return total;
}

// BEFORE CALLING any of the functions (Input array of objects):
// [
//   { id: 1, name: "HairDryer", price: 25.99, inStock: true, qty: 40 },
//   { id: 2, name: "Keyboard", price: 89.5, inStock: true, qty: 15 },
//   { id: 3, name: "Type-C cable", price: 34, inStock: false, qty: 0 },
//   { id: 4, name: "Monitor", price: 249, inStock: true, qty: 8 },
//   { id: 5, name: "Laptop Stand", price: 14.3, inStock: true, qty: 60 },
//   { id: 6, name: "Lamp", price: 45.0, inStock: false, qty: 0 },
//   { id: 7, name: "Airpods", price: 129.99, inStock: true, qty: 12 },
//   { id: 8, name: "Towels", price: 79.4, inStock: true, qty: 30 },
//   { id: 9, name: "Bluetooth Speaker", price: 100, inStock: false, qty: 0 },
//   { id: 10, name: "SSD 1TB", price: 99, inStock: true, qty: 20 },
//   { id: 11, name: "Office Chair", price: 190, inStock: true, qty: 5 },
//   { id: 12, name: "Airfryer", price: 10, inStock: true, qty: 100 }
// ]

const grandTotal = totalInventoryValue(products);
console.log(
  `Total Inventory Value: $${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
);
console.log("-".repeat(50));

const allNames = listName(products);
console.log(`Products List (${allNames.length} Items):`);
console.log(allNames.map((name) => `  • ${name}`).join("\n"));
console.log("-".repeat(50));

// AFTER CALLING listName ( Returned array of strings):
// [
//   "HairDryer",
//   "Keyboard",
//   "Type-C cable",
//   "Monitor",
//   "Laptop Stand",
//   "Lamp",
//   "Airpods",
//   "Towels",
//   "Bluetooth Speaker",
//   "SSD 1TB",
//   "Office Chair",
//   "Airfryer"
// ]

const stockNames = isInStock(products);
console.log(`Currently In Stock (${stockNames.length} Items):`);
console.log(stockNames.map((name) => `${name}`).join("\n"));
console.log("-".repeat(50));

// AFTER CALLING  the insStock (Returned array of filtered strings where inStock is true):
// [
//   "HairDryer",
//   "Keyboard",
//   "Monitor",
//   "Laptop Stand",
//   "Airpods",
//   "Towels",
//   "SSD 1TB",
//   "Office Chair",
//   "Airfryer"
// ]

const sortedInventory = sortByPriceThenName(products);
console.log(" Inventory Sorted by Price (Lowest to Highest):");
console.table(sortedInventory, ["id", "name", "price", "qty"]);

// AFTER CALLING sort (Returned array of objects sorted by price then by name) :
// [
//   { id: 12, name: "Airfryer", price: 10, inStock: true, qty: 100 },
//   { id: 5, name: "Laptop Stand", price: 14.3, inStock: true, qty: 60 },
//   { id: 1, name: "HairDryer", price: 25.99, inStock: true, qty: 40 },
//   { id: 3, name: "Type-C cable", price: 34, inStock: false, qty: 0 },
//   { id: 6, name: "Lamp", price: 45, inStock: false, qty: 0 },
//   { id: 8, name: "Towels", price: 79.4, inStock: true, qty: 30 },
//   { id: 2, name: "Keyboard", price: 89.5, inStock: true, qty: 15 },
//   { id: 10, name: "SSD 1TB", price: 99, inStock: true, qty: 20 },
//   { id: 9, name: "Bluetooth Speaker", price: 100, inStock: false, qty: 0 },
//   { id: 7, name: "Airpods", price: 129.99, inStock: true, qty: 12 },
//   { id: 11, name: "Office Chair", price: 190, inStock: true, qty: 5 },
//   { id: 4, name: "Monitor", price: 249, inStock: true, qty: 8 }
// ]

let newProducts = [...products];

newProducts.sort((a, b) => {
  return a.qty - b.qty;
});
console.log(
  "the newProduct Array (modified version products array): ",
  newProducts,
);
console.log(
  "original Array of products (unchanged due to using shallow copy i.e spread operator ... ",
  products,
);
