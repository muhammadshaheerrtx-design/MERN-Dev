import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginPage />}
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      {/* Any unknown path falls back to the right place depending on auth state */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} replace />} />
    </Routes>
  );
}
