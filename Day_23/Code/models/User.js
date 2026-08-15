// User "model" — in-memory for now (real DB comes next week).
// IMPORTANT: only ever stores the HASHED password, never the plain one.

let users = [];
let nextId = 1;

const User = {
  findByEmail(email) {
    return users.find((u) => u.email === email.toLowerCase()) || null;
  },

  findById(id) {
    return users.find((u) => u.id === id) || null;
  },

  create({ name, email, passwordHash }) {
    const user = {
      id: nextId++,
      name,
      email: email.toLowerCase(),
      passwordHash,
    };
    users.push(user);
    return user;
  },

  // Never send passwordHash back to the client.
  toPublic(user) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  },
};

module.exports = User;
