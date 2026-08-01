const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchTopCoins(currency = "usd", limit = 50) {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    console.error("Fetch failed:", err);
    return { data: null, error: err.message || "Failed to fetch coin data." };
  }
}
