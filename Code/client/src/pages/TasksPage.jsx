import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import { getTasks, createTask, deleteTask } from "../api.js";

export default function TasksPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const result = await getTasks();
      setTasks(result.data);
    } catch (err) {
      // A 401 here means the stored token is invalid/expired — bounce
      // back to login rather than showing a confusing empty error state.
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setTasksError(err.response?.data?.error || "Network error — is the server running?");
    } finally {
      setTasksLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreate(taskInput) {
    setCreating(true);
    setCreateError(null);
    try {
      const result = await createTask(taskInput);
      setTasks((prev) => [result.data, ...prev]);
    } catch (err) {
      setCreateError(err.response?.data?.error || "Couldn't create task.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setTasksError(err.response?.data?.error || "Couldn't delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1 className="brand">Taskline</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button type="button" className="btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="app-main">
        <TaskForm onCreate={handleCreate} creating={creating} />
        {createError && <p className="error-text" role="alert">{createError}</p>}

        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          error={tasksError}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </main>
    </div>
  );
}
