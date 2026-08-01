/**
 * Formats a number into standard USD currency string ($1,234.56).
 * Handles tiny fractions for small crypto prices automatically.
 *
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }

  // Handle low-value micro-crypto prices (e.g., $0.000012)
  const maximumFractionDigits = amount < 1 ? 6 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maximumFractionDigits,
  }).format(amount);
}

/**
 * Formats a number into a percentage string (+2.45% or -1.10%).
 *
 * @param {number} percent
 * @returns {string} Formatted percent string
 */
export function formatPercent(percent) {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return "0.00%";
  }

  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Formats large market cap numbers into human-readable notation ($1.2B, $450M).
 *
 * @param {number} number
 * @returns {string} Compact number string
 */
export function formatCompactNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number);
}

/**
 * Debounce helper function to delay function execution until user stops typing.
 * Useful for optimizing search inputs.
 *
 * @param {Function} func The function to execute
 * @param {number} delay Delay time in milliseconds
 * @returns {Function}
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
