import { useState } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import "./App.css";

export default function App() {
  // Shared state lifted to common parent
  const [books, setBooks] = useState([
    {
      id: "1",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      genre: "Tech & Coding",
      rating: 5,
      addedAt: "8/6/2026",
    },
  ]);

  // Handler passed down to BookForm
  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };

  // Handler passed down to BookList
  const handleDeleteBook = (bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📖 Personal Reading Tracker</h1>
        <p>Day 16 — Shared State & Controlled Form Component</p>
      </header>

      <main className="app-grid">
        <section>
          <BookForm onAddBook={handleAddBook} />
        </section>

        <section>
          <BookList books={books} onDeleteBook={handleDeleteBook} />
        </section>
      </main>
    </div>
  );
}
