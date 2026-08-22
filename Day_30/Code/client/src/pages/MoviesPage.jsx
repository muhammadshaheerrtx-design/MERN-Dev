import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MovieForm from "../components/MovieForm.jsx";
import MovieList from "../components/MovieList.jsx";
import { getMovies, createMovie, updateMovie, deleteMovie } from "../api.js";

export default function MoviesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchMovies = useCallback(async () => {
    setMoviesLoading(true);
    setMoviesError(null);
    try {
      // filterStatus flows straight into a query param — same pattern
      // as ?status= filtering on the Tasks app and the Day 26 exercise.
      const params = filterStatus ? { status: filterStatus } : undefined;
      const result = await getMovies(params);
      setMovies(result.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setMoviesError(err.response?.data?.error || "Network error — is the server running?");
    } finally {
      setMoviesLoading(false);
    }
  }, [filterStatus, logout, navigate]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  async function handleCreate(movieInput) {
    setCreating(true);
    setCreateError(null);
    try {
      const result = await createMovie(movieInput);
      setMovies((prev) => [result.data, ...prev]);
    } catch (err) {
      setCreateError(err.response?.data?.error || "Couldn't add movie.");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleStatus(movie) {
    setTogglingId(movie._id);
    const newStatus = movie.status === "watched" ? "to-watch" : "watched";
    try {
      const result = await updateMovie(movie._id, { status: newStatus });
      setMovies((prev) => prev.map((m) => (m._id === movie._id ? result.data : m)));
    } catch (err) {
      setMoviesError(err.response?.data?.error || "Couldn't update movie.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setMoviesError(err.response?.data?.error || "Couldn't delete movie.");
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
        <h1 className="brand">Watchlist</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button type="button" className="btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="app-main">
        <MovieForm onCreate={handleCreate} creating={creating} />
        {createError && <p className="error-text" role="alert">{createError}</p>}

        <MovieList
          movies={movies}
          loading={moviesLoading}
          error={moviesError}
          onDelete={handleDelete}
          deletingId={deletingId}
          onToggleStatus={handleToggleStatus}
          togglingId={togglingId}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
        />
      </main>
    </div>
  );
}
