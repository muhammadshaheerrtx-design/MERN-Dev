// Products main database file and accessing functions

let products = [
  { id: 1, name: "Wireless Mouse", price: 1500, category: "electronics" },
  { id: 2, name: "Mechanical Keyboard", price: 6500, category: "electronics" },
  { id: 3, name: "Notebook", price: 150, category: "stationery" },
];

let nextId = 4;

const Product = {
  findAll(filter = {}) {
    let result = products;
    if (filter.category) {
      result = result.filter((p) => p.category === filter.category);
    }
    return result;
  },

  findById(id) {
    return products.find((p) => p.id === id) || null;
  },

  create({ name, price, category }) {
    const product = { id: nextId++, name, price, category };
    products.push(product);
    return product;
  },

  replaceById(id, { name, price, category }) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { id, name, price, category };
    return products[index];
  },

  updateById(id, updates) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    return products[index];
  },

  deleteById(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};

module.exports = Product;
