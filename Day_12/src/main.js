import { fetchTopCoins } from "./api.js";
import { setCoins, setSearchQuery, setSortBy, getState } from "./state.js";
import { renderCoinList } from "./components.js";

const tableBody = document.querySelector("#coin-table-body");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const statusContainer = document.querySelector("#status-container");

async function initApp() {
  statusContainer.textContent = "Loading market data...";

  const { data, error } = await fetchTopCoins();

  if (error) {
    statusContainer.textContent = `Error: ${error}`;
    return;
  }

  statusContainer.textContent = "";
  setCoins(data);
  updateUI();
}

function updateUI() {
  const { filteredCoins } = getState();
  renderCoinList(tableBody, filteredCoins);
}

// Event Listeners (User Interaction)
searchInput.addEventListener("input", (e) => {
  setSearchQuery(e.target.value);
  updateUI();
});

sortSelect.addEventListener("change", (e) => {
  setSortBy(e.target.value);
  updateUI();
});

document.addEventListener("DOMContentLoaded", initApp);
