const state = {
  rawCoins: [],
  filteredCoins: [],
  searchQuery: "",
  sortBy: "market_cap_desc",
  isLoading: false,
  error: null,
};

export function setCoins(coins) {
  state.rawCoins = [...coins];
  applyFiltersAndSort();
}

export function setSearchQuery(query) {
  state.searchQuery = query.toLowerCase().trim();
  applyFiltersAndSort();
}

export function setSortBy(criterion) {
  state.sortBy = criterion;
  applyFiltersAndSort();
}

function applyFiltersAndSort() {
  // 1. Filter immutably
  let result = state.rawCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(state.searchQuery) ||
      coin.symbol.toLowerCase().includes(state.searchQuery),
  );

  // 2. Sort immutably
  result = [...result].sort((a, b) => {
    if (state.sortBy === "price_asc") return a.current_price - b.current_price;
    if (state.sortBy === "price_desc") return b.current_price - a.current_price;
    if (state.sortBy === "change_desc")
      return b.price_change_percentage_24h - a.price_change_percentage_24h;
    return b.market_cap - a.market_cap; // Default: market cap
  });

  state.filteredCoins = result;
}

export function getState() {
  return { ...state, filteredCoins: [...state.filteredCoins] };
}
