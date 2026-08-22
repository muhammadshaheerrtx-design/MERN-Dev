import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any route that should only be reachable while logged in.
// If there's no token, redirect to /login instead of rendering children.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
