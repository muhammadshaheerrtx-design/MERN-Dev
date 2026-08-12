let products = [
  { id: 1, name: "Spoon", price: 1500, category: "electronics" },
  { id: 2, name: "Mechanical tootbrush", price: 6500, category: "electronics" },
  { id: 3, name: "Notebook", price: 150, category: "stationery" },
];

let nextId = 4;

module.exports = {
  getAll: () => products,
  getById: (id) => products.find((p) => p.id === id),
  create: (data) => {
    const newProduct = { id: nextId++, ...data };
    products.push(newProduct);
    return newProduct;
  },
  replace: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { id, ...data };
    return products[index];
  },
  update: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data };
    return products[index];
  },
  remove: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};
