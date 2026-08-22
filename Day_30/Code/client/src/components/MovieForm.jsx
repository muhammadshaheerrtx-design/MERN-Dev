import { useState } from "react";

export default function MovieForm({ onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("to-watch");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      genre: genre.trim(),
      status,
      rating: rating ? Number(rating) : null,
      notes: notes.trim(),
    });

    setTitle("");
    setGenre("");
    setStatus("to-watch");
    setRating("");
    setNotes("");
    setExpanded(false);
  }

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <div className="movie-form-row">
        <input
          type="text"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Movie title"
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="to-watch">To watch</option>
          <option value="watched">Watched</option>
        </select>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Less" : "More"}
        </button>
        <button type="submit" className="btn-primary" disabled={creating}>
          {creating ? "Adding…" : "Add"}
        </button>
      </div>

      {expanded && (
        <div className="movie-form-extra">
          <input
            type="text"
            placeholder="Genre (optional)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rating 1-5"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      )}
    </form>
  );
}
