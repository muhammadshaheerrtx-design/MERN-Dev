import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("normal");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  function addTodo() {
    if (text.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
      priority: priority,
    };

    setTodos([...todos, newTodo]);
    setText("");
    setPriority("normal");
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.done));
  }

  // First apply status filter, then apply search query
  const statusFiltered = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true; // "all"
  });

  const visibleTodos = statusFiltered.filter((todo) =>
    todo.text.toLowerCase().includes(query.toLowerCase()),
  );

  const remainingCount = todos.filter((todo) => !todo.done).length;

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>

      {/* Add new todo */}
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="todo-search"
      />

      {/* Status filter tabs */}
      <div className="todo-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Task list */}
      <ul>
        {visibleTodos.length === 0 && (
          <p className="empty-state">No tasks found.</p>
        )}

        {visibleTodos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <div className="todo-left">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
              <span className={`priority-tag priority-${todo.priority}`}>
                {todo.priority}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="todo-footer">
        <span>
          {remainingCount} task{remainingCount !== 1 ? "s" : ""} remaining
        </span>
        <button onClick={clearCompleted}>Clear Completed</button>
      </div>
    </div>
  );
}

export default TodoList;
