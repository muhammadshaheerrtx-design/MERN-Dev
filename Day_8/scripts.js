// --- State (Single Source of Truth) ---
let todos = [
  { id: 1, text: "Build interactive UI with Vanilla JS", done: true },
  { id: 2, text: "Implement event delegation", done: false },
];

// --- DOM Elements ---
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

// --- Render Function ---
function render() {
  if (todos.length === 0) {
    todoList.innerHTML = `<li class="empty-state">No tasks remaining! 🎉</li>`;
    return;
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
      <li class="todo-item ${todo.done ? "completed" : ""}" data-id="${todo.id}">
        <div class="todo-content" data-action="toggle">
          <input 
            type="checkbox" 
            ${todo.done ? "checked" : ""} 
            data-action="toggle" 
          />
          <span class="todo-text" data-action="toggle">${todo.text}</span>
        </div>
        <button type="button" class="btn-delete" data-action="delete">Delete</button>
      </li>
    `,
    )
    .join("");
}

// 1. Add Task Handler
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    done: false,
  };

  todos.push(newTodo);
  todoInput.value = "";
  render();
});

// 2. Event Delegation Handler (for list actions: mark done & delete)
todoList.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const todoItem = e.target.closest(".todo-item");
  if (!todoItem) return;

  const id = Number(todoItem.dataset.id);

  if (action === "toggle") {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo,
    );
    render();
  } else if (action === "delete") {
    todos = todos.filter((todo) => todo.id !== id);
    render();
  }
});

// Initial Render
render();
