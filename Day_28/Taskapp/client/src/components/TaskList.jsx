const STATUS_LABEL = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
};

export default function TaskList({ tasks, loading, error, onDelete, deletingId }) {
  if (loading) {
    return <p className="hint">Loading your tasks…</p>;
  }

  if (error) {
    return (
      <div className="error-banner" role="alert">
        <strong>Couldn't load tasks.</strong> {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p className="hint">No tasks yet — add your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className={`task-item status-${task.status}`}>
          <div className="task-main">
            <span className="task-title">{task.title}</span>
            <span className="task-status">{STATUS_LABEL[task.status] || task.status}</span>
          </div>
          <button
            type="button"
            className="btn-delete"
            onClick={() => onDelete(task._id)}
            disabled={deletingId === task._id}
            aria-label={`Delete "${task.title}"`}
          >
            {deletingId === task._id ? "Deleting…" : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
