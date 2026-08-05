export default function BookCard({ book }) {
  const title = book.title || "Untitled";
  const author = book.author_name
    ? book.author_name.join(", ")
    : "Unknown Author";
  const year = book.first_publish_year || "N/A";

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/128x192?text=No+Cover";

  return (
    <div className="book-card">
      <img src={coverUrl} alt={title} className="book-cover" />
      <div className="book-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">By {author}</p>
        <span className="book-year">First Published: {year}</span>
      </div>
    </div>
  );
}
