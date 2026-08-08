export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedVendor,
  setSelectedVendor,
  vendors = [],
  sortBy,
  setSortBy,
}) {
  return (
    <div className="filter-bar">
      <div className="search-group">
        <input
          type="text"
          placeholder="Search by CVE ID, vendor, or vulnerability name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="clear-btn"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="select-group">
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="filter-select"
        >
          <option value="">All Vendors / Projects</option>
          {vendors.map(([vendor, count]) => (
            <option key={vendor} value={vendor}>
              {vendor} ({count})
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Sort by: Date Added (Newest)</option>
          <option value="oldest">Sort by: Date Added (Oldest)</option>
          <option value="cve">Sort by: CVE ID</option>
        </select>
      </div>
    </div>
  );
}
