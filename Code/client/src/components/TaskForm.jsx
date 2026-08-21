import { useState } from "react";

export default function TaskForm({ onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), status });
    setTitle("");
    setStatus("pending");
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit" className="btn-primary" disabled={creating}>
        {creating ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}
