// Task "model" — in-memory. Every task is owned by a userId, so users
// only ever see/modify their own tasks (enforced in the controller).

let tasks = [];
let nextId = 1;

const Task = {
  findAllByUser(userId, filter = {}) {
    let result = tasks.filter((t) => t.userId === userId);
    if (filter.status) {
      result = result.filter((t) => t.status === filter.status);
    }
    return result;
  },

  findByIdAndUser(id, userId) {
    return tasks.find((t) => t.id === id && t.userId === userId) || null;
  },

  create({ userId, title, description, status }) {
    const task = {
      id: nextId++,
      userId,
      title,
      description: description || "",
      status: status || "pending", // pending | in-progress | done
    };
    tasks.push(task);
    return task;
  },

  replace(id, userId, { title, description, status }) {
    const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) return null;
    tasks[index] = { id, userId, title, description: description || "", status };
    return tasks[index];
  },

  update(id, userId, updates) {
    const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  },

  delete(id, userId) {
    const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};

module.exports = Task;
