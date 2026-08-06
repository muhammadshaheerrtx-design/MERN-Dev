import { useState } from "react";
import Card from "./Card";

export default function BookForm({ onAddBook }) {
  // Controlled form inputs
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [rating, setRating] = useState("5");

  // Validation state
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Book title is required.";
    if (!author.trim()) newErrors.author = "Author name is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default page refresh

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Construct new book object
    const newBook = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      genre,
      rating: Number(rating),
      addedAt: new Date().toLocaleDateString(),
    };

    // Callback up to parent state
    onAddBook(newBook);

    // Reset form & errors
    setTitle("");
    setAuthor("");
    setGenre("Fiction");
    setRating("5");
    setErrors({});
  };

  return (
    <Card title="Add a New Book">
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Clean Code"
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g., Robert C. Martin"
            className={errors.author ? "input-error" : ""}
          />
          {errors.author && <span className="error-text">{errors.author}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Tech & Coding">Tech & Coding</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add to Reading List
        </button>
      </form>
    </Card>
  );
}
