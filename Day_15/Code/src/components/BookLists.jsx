import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BookCard from "./BookCards";

const CATEGORIES = [
  { label: " General Fiction", query: "subject:fiction" },
  { label: " Classic Novels", query: "classic+novels" },
  { label: " Fantasy", query: "subject:fantasy" },
  { label: " Mystery & Thriller", query: "subject:mystery" },
  { label: " Science Fiction", query: "subject:science_fiction" },
];

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("subject:fiction");

  // 1. Pagination State
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const ITEMS_PER_PAGE = 20;

  // 2. Data Fetching Effect
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      try {
        // Pass limit and page to the Open Library Search API
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${selectedCategory}&limit=${ITEMS_PER_PAGE}&page=${page}`,
          { signal },
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data.docs || []);

        // Open Library returns the total matching books count in `numFound`
        setTotalResults(data.numFound || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch book catalog.");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, [selectedCategory, page, refreshIndex]);

  // Derived State: Search filter within current page results
  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(term);
    const authorMatch = book.author_name?.some((a) =>
      a.toLowerCase().includes(term),
    );
    return titleMatch || authorMatch;
  });

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return (
    <div className="book-list-container">
      <h1> Fiction & Novel Explorer</h1>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.query}
            onClick={() => {
              setSelectedCategory(cat.query);
              setPage(1); // Reset back to Page 1 on category change!
              setSearchTerm("");
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #0066cc",
              backgroundColor:
                selectedCategory === cat.query ? "#0066cc" : "#ffffff",
              color: selectedCategory === cat.query ? "#ffffff" : "#0066cc",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Refresh */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={() => setRefreshIndex((prev) => prev + 1)}
        loading={loading}
      />

      {/* Results Header */}
      {!loading && !error && (
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
          Found <strong>{totalResults.toLocaleString()}</strong> books total
          (Page {page} of {totalPages})
        </p>
      )}

      {/* States */}
      {loading && (
        <div className="status-box">
          <p>Loading page {page}...</p>
        </div>
      )}

      {error && (
        <div className="status-box status-box-error">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={() => setRefreshIndex((prev) => prev + 1)}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredBooks.length === 0 && (
        <div className="status-box">
          <p>No books found matching "{searchTerm}".</p>
        </div>
      )}

      {!loading && !error && filteredBooks.length > 0 && (
        <>
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>

          {/* 3. Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
              style={{
                padding: "8px 16px",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous Page
            </button>

            <span>
              Page <strong>{page}</strong> of {totalPages}
            </span>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                padding: "8px 16px",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}
