const STATUS_LABEL = {
  "to-watch": "To watch",
  watched: "Watched",
};

export default function MovieList({
  movies,
  loading,
  error,
  onDelete,
  deletingId,
  onToggleStatus,
  togglingId,
  filterStatus,
  onFilterStatusChange,
}) {
  return (
    <div>
      <div className="filter-bar">
        <label>
          Filter:
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="to-watch">To watch</option>
            <option value="watched">Watched</option>
          </select>
        </label>
      </div>

      {loading && <p className="hint">Loading your movies…</p>}

      {!loading && error && (
        <div className="error-banner" role="alert">
          <strong>Couldn't load movies.</strong> {error}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className="hint">No movies yet — add your first one above.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li key={movie._id} className={`movie-item status-${movie.status}`}>
              <div className="movie-main">
                <div className="movie-title-row">
                  <span className="movie-title">{movie.title}</span>
                  {movie.genre && <span className="movie-genre">{movie.genre}</span>}
                  {movie.rating && <span className="movie-rating">★ {movie.rating}</span>}
                </div>
                {movie.notes && <p className="movie-notes">{movie.notes}</p>}
              </div>

              <div className="movie-actions">
                <button
                  type="button"
                  className="btn-ghost small"
                  onClick={() => onToggleStatus(movie)}
                  disabled={togglingId === movie._id}
                >
                  {togglingId === movie._id
                    ? "…"
                    : movie.status === "watched"
                    ? "Mark to-watch"
                    : "Mark watched"}
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => onDelete(movie._id)}
                  disabled={deletingId === movie._id}
                  aria-label={`Delete "${movie.title}"`}
                >
                  {deletingId === movie._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
