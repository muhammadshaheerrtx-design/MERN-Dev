# Day 21 — Middleware, Validation, Config & CORS

Hardened version of the Day 20 Products CRUD API: adds custom middleware,
centralized error handling, manual input validation, environment-based
config, and CORS support.

## What's new since Day 20

- `middleware/requestLogger.js` — logs every incoming request
- `middleware/notFound.js` — converts unmatched routes into an Error and forwards it
- `middleware/errorHandler.js` — single place that formats every error response
- `middleware/validateProduct.js` — manual validation for create/replace/update, returns 400 with details on bad input
- `.env` / `.env.example` — PORT, NODE_ENV, CORS_ORIGIN now configurable instead of hardcoded
- `cors` — enabled so a front-end running on a different origin (e.g. Vite dev server) can call this API

## Project structure

```
day21-hardened-api/
├── server.js                       # loads dotenv, wires up middleware in order, mounts routes
├── routes/
│   └── products.js                  # router.route() chains + validation middleware per route
├── controllers/
│   └── productsController.js         # data logic only — validation lives in middleware now
├── middleware/
│   ├── requestLogger.js
│   ├── validateProduct.js
│   ├── notFound.js
│   └── errorHandler.js
├── data/
│   └── products.js
├── .env                              # local config (gitignored)
├── .env.example                       # committed template of required vars
├── nodemon.json
└── package.json
```

## Middleware order (why it matters)

```
cors()  ->  express.json()  ->  requestLogger  ->  routes  ->  notFound  ->  errorHandler
```

- CORS runs first so cross-origin requests (including preflight `OPTIONS`) are handled before anything else.
- `express.json()` must run before any route reads `req.body`.
- Route-level validation middleware (e.g. `validateProductBody`) runs before the controller, so the controller can trust that `req.body` is already valid.
- `notFound` only fires if nothing above matched — it builds an `Error` with `statusCode = 404` and calls `next(error)`.
- `errorHandler` is always last. Express identifies it as an error handler because it takes **4** arguments `(err, req, res, next)` instead of 3. Every error in the app — validation, 404, or unexpected — ends up here and gets the same JSON shape.

## Setup

```bash
cd day21-hardened-api
npm install
cp .env.example .env   # already provided with sensible defaults
```

## Run

```bash
npm run dev
```

Server runs at **http://localhost:3000**. `CORS_ORIGIN` in `.env` controls which front-end origin is allowed to call the API (defaults to a typical Vite dev server URL, `http://localhost:5173`).

## Validation behavior

| Route | Body required | Rejected with 400 if... |
|---|---|---|
| `POST /api/products` | `name`, `price`, `category` | any field missing, `price` not a positive number, `name`/`category` empty |
| `PUT /api/products/:id` | same as POST (full replace) | same as above |
| `PATCH /api/products/:id` | any subset | body empty, or a provided field is the wrong type |
| any `/:id` route | — | `id` isn't a valid number |

Example validation error response (`POST /api/products` with `{ "name": "Bad" }`):

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "price is required",
    "category is required and must be a non-empty string"
  ]
}
```

## Testing with Postman

Same endpoints as Day 20, plus these new error-path checks:

1. `POST /api/products` with an incomplete body → **400** with `details` array (screenshot this one — it's the required deliverable)
2. `PATCH /api/products/1` with an empty body `{}` → **400**, "Request body cannot be empty"
3. `GET /api/products/abc` → **400**, "id must be a number"
4. `GET /api/nonexistent` → **404**, routed through the same error handler as everything else
5. All Day 20 happy-path requests (GET list, GET one, POST, PUT, PATCH, DELETE) should still return 200/201 as before

## curl reference

```bash
# validation error
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" -d '{"name":"Bad"}'

# empty PATCH body
curl -s -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" -d '{}'

# bad id
curl -s http://localhost:3000/api/products/abc

# CORS preflight check
curl -s -i -X OPTIONS http://localhost:3000/api/products \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```
