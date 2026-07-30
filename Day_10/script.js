/**
 * script.js — Country Explorer
 * -----------------------------------------------------------------------
 * Day 10 practical task: fetch a list of items from a free public API,
 * render them to the DOM with loading + error handling, and add a
 * search/filter box that re-renders the list as the user types.
 *
 * API used: REST Countries — https://restcountries.com
 * A real, actively maintained public API. No API key required, CORS-enabled.
 * -----------------------------------------------------------------------
 */

const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca2";

// --- State (single source of truth) ---
let allCountries = []; // everything fetched from the API, never mutated after load

// --- DOM elements ---
const statusEl = document.getElementById("status");
const countryGrid = document.getElementById("countryGrid");
const searchInput = document.getElementById("searchInput");

// --- Status helpers (loading / error / hidden) ---
function showLoading() {
  statusEl.textContent = "Loading countries...";
  statusEl.className = "";
  statusEl.style.display = "block";
  countryGrid.innerHTML = "";
}

function showError(message) {
  statusEl.className = "error";
  statusEl.style.display = "block";
  statusEl.innerHTML = `${message} <button id="retryBtn" type="button">Retry</button>`;
  document.getElementById("retryBtn").addEventListener("click", loadCountries);
}

function hideStatus() {
  statusEl.style.display = "none";
}

// --- Render a list of countries to the grid ---
function renderCountries(countries) {
  if (countries.length === 0) {
    countryGrid.innerHTML = `<p class="empty-state">No countries match your search.</p>`;
    return;
  }

  countryGrid.innerHTML = countries
    .map((country) => {
      const capital = country.capital ? country.capital[0] : "N/A";
      const population = country.population.toLocaleString();

      return `
        <div class="country-card">
          <img src="${country.flags.png}" alt="${country.flags.alt || country.name.common + " flag"}" />
          <div class="country-card-body">
            <p class="country-name">${country.name.common}</p>
            <p class="country-detail">Capital: ${capital}</p>
            <p class="country-detail">Region: ${country.region}</p>
            <p class="country-detail">Population: ${population}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

// --- Fetch countries from the API ---
async function loadCountries() {
  showLoading();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    // Sort alphabetically so the initial list is easy to scan
    allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    hideStatus();
    renderCountries(allCountries);
  } catch (error) {
    showError(`Failed to load countries: ${error.message}`);
  }
}

// --- Search / filter handler ---
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  const filtered = allCountries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(query) ||
      country.region.toLowerCase().includes(query),
  );

  renderCountries(filtered);
});

// --- Initial load ---
loadCountries();
