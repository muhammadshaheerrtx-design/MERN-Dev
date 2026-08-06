import Card from "./Card";

export default function BookList({ books, onDeleteBook }) {
  if (books.length === 0) {
    return (
      <Card>
        <p className="empty-message">
          Your reading list is empty. Add a book using the form!
        </p>
      </Card>
    );
  }

  return (
    <Card title={`Your Reading List (${books.length})`}>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <div className="book-info">
              <h4>{book.title}</h4>
              <p className="book-meta">
                By <strong>{book.author}</strong> • <em>{book.genre}</em>
              </p>
              <span className="book-rating">{"⭐".repeat(book.rating)}</span>
            </div>
            <button
              onClick={() => onDeleteBook(book.id)}
              className="delete-btn"
              title="Delete book"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
