import { formatCurrency, formatPercent } from "./utils.js";

export function renderCoinList(container, coins) {
  if (coins.length === 0) {
    container.innerHTML = `<div class="empty-state">No assets found matching your criteria.</div>`;
    return;
  }

  const html = coins
    .map(
      (coin) => `
    <tr class="coin-row">
      <td class="coin-info">
        <img src="${coin.image}" alt="${coin.name}" width="24" height="24" loading="lazy" />
        <span class="coin-name">${coin.name}</span>
        <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
      </td>
      <td>${formatCurrency(coin.current_price)}</td>
      <td class="${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}">
        ${formatPercent(coin.price_change_percentage_24h)}
      </td>
      <td>${formatCurrency(coin.market_cap)}</td>
    </tr>
  `,
    )
    .join("");

  container.innerHTML = html;
}
