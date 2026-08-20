import { useEffect, useState, useCallback } from "react";
import "./App.css";
import AuthForm from "./components/AuthForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { setAuthToken, getTasks, createTask, deleteTask } from "./api.js";

export default function App() {
  // Auth state kept in memory only for Day 28 — persisting the JWT across
  // page reloads (localStorage) and route protection are Day 29's job.
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

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
      setTasksError(err.response?.data?.error || "Network error — is the server running?");
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  function handleAuthenticated(newToken, newUser) {
    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function handleLogout() {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setTasks([]);
  }

  async function handleCreate(taskInput) {
    setCreating(true);
    setCreateError(null);
    try {
      const result = await createTask(taskInput);
      // Prepend the new task so it's immediately visible without a refetch.
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

  if (!token) {
    return (
      <div className="page centered">
        <AuthForm onAuthenticated={handleAuthenticated} />
      </div>
    );
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
