// In-memory "database" so we don't need a real DB yet.
// Each server restart resets this data (unless nodemon just reloaded the file).

let users = [
  { id: 1, name: "Ali Raza", email: "ali@example.com", role: "admin" },
  { id: 2, name: "Sara Khan", email: "sara@example.com", role: "user" },
  { id: 3, name: "Bilal Ahmed", email: "bilal@example.com", role: "user" },
];

let nextId = 4;

module.exports = {
  getAll: () => users,
  getById: (id) => users.find((u) => u.id === id),
  create: (data) => {
    const newUser = { id: nextId++, ...data };
    users.push(newUser);
    return newUser;
  },
  replace: (id, data) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { id, ...data };
    return users[index];
  },
  update: (id, data) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
  },
  remove: (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
