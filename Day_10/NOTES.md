# Day 10 — Country Explorer

## API used

**REST Countries** — https://restcountries.com (v3.1)

- Real, actively maintained public API (in production use since 2015,
  currently tracked as the reference country-data API by multiple dev
  directories)
- Completely free, **no API key / no auth required**
- CORS-enabled — works directly from a browser with plain `fetch()`
- Endpoint used:
  `https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca2`
  (the `fields` parameter is required by this API when calling `/all` —
  it trims the huge default payload down to just what the app needs)

## Response shape

A `GET` request returns `200 OK` with a JSON array of ~250 country
objects. Each item looks like this (trimmed to the fields requested):

```json
{
  "name": {
    "common": "Pakistan",
    "official": "Islamic Republic of Pakistan"
  },
  "capital": ["Islamabad"],
  "region": "Asia",
  "population": 220892340,
  "flags": {
    "png": "https://flagcdn.com/w320/pk.png",
    "svg": "https://flagcdn.com/pk.svg",
    "alt": "The flag of Pakistan is..."
  },
  "cca2": "PK"
}
```

Fields used in this app:
- `name.common` — display name
- `capital[0]` — capital city (an array, since a few countries list more than one)
- `region` — continent-level grouping, also used for search
- `population` — formatted with `toLocaleString()`
- `flags.png` / `flags.alt` — flag image + accessible alt text

## How it works

1. On page load, `loadCountries()` shows a loading message, then
   `fetch()`s the country list.
2. If the response isn't OK, or the network request fails (e.g. offline),
   an error message with a **Retry** button is shown instead of the grid.
3. On success, results are sorted alphabetically by common name, stored
   in `allCountries`, and rendered as cards.
4. Typing in the search box filters `allCountries` client-side by country
   name or region (case-insensitive) and re-renders — no extra network
   requests while searching.

## Files

- `index.html` — page structure + styling
- `script.js` — fetch logic, render function, loading/error states, search filter

## How to run

Just open `index.html` in a browser (or serve it with any static server).
No build step or dependencies needed.
