export default function SearchBar({
  searchTerm,
  setSearchTerm,
  onRefresh,
  loading,
}) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search loaded books by title or author..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={onRefresh} disabled={loading} className="search-button">
        {loading ? "Refreshing..." : "🔄 Refresh Data"}
      </button>
    </div>
  );
}
