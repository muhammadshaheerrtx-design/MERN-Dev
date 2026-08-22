# Day 22 — API Testing & Clean Structure

Refactored version of the Day 21 hardened API: adds a proper `models/` layer,
a shared response-shape helper, and a full Postman collection covering every
endpoint's happy and error paths.

- **`models/Product.js`** — data access pulled out of a loose `data/` file into a proper model with a clean method interface (`findAll`, `findById`, `create`, `replaceById`, `updateById`, `deleteById`). This is the shape a real Mongoose model will eventually take.
- **`utils/response.js`** — `sendSuccess()` / `sendError()` helpers so the JSON response shape is _enforced_ by shared code. Every controller, every validation middleware, and the error handler all go through these two functions.
- **`postman_collection.json`** — a full, importable Postman collection covering every endpoint, both happy paths and error paths.

## Project structure (matches the required routes/controllers/middleware/models layout)

```
day22-tested-api/
├── server.js
├── routes/
│   └── products.js
├── controllers/
│   └── productsController.js
├── middleware/
│   ├── requestLogger.js
│   ├── validateProduct.js
│   ├── notFound.js
│   └── errorHandler.js
├── models/
│   └── Product.js
├── utils/
│   └── response.js
├── postman_collection.json
├── .env / .env.example
├── nodemon.json
└── package.json
```

## Standardized response shape

Every endpoint now returns one of exactly two shapes:

**Success**

```json
{ "success": true, "data": {...}, "count": 3 }
```

(`count` only appears on list endpoints; `message` appears on delete)

**Error**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["price is required"]
}
```

(`details` only appears when there's more than one thing wrong)

This is enforced because every response goes through `sendSuccess`/`sendError` in `utils/response.js` — no handler builds its own JSON object by hand anymore.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Postman collection

Import `postman_collection.json` directly into Postman (**Import → File**). It's organized into four folders:

| Folder                     | Covers                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Root / Health**          | `GET /`, unmatched route → 404                                                                                                     |
| **Products - Happy Paths** | full CRUD lifecycle: create → read → update (PATCH) → replace (PUT) → delete, in order,                                            |
| **Products - Error Paths** | every validation and not-found case: bad id, missing fields, negative price, empty PATCH body, updating/deleting a non-existent id |

The **Happy Paths** folder uses a `{{createdId}}` collection variable, auto-captured from the POST response via a small test script, so PATCH/PUT/DELETE run against the product that was actually just created — run that folder top-to-bottom in order (Postman's "Run collection" feature works well here).

### Full endpoint list covered

| Method  | Path                                 | Case                 | Expected |
| ------- | ------------------------------------ | -------------------- | -------- |
| GET     | `/`                                  | welcome              | 200      |
| GET     | `/nonexistent`                       | unmatched route      | 404      |
| GET     | `/api/products`                      | list all             | 200      |
| GET     | `/api/products?category=electronics` | filtered list        | 200      |
| GET     | `/api/products/1`                    | single item          | 200      |
| GET     | `/api/products/abc`                  | invalid id           | 400      |
| GET     | `/api/products/999`                  | missing resource     | 404      |
| POST    | `/api/products`                      | valid body           | 201      |
| POST    | `/api/products`                      | missing fields       | 400      |
| POST    | `/api/products`                      | negative price       | 400      |
| PATCH   | `/api/products/:id`                  | valid partial update | 200      |
| PATCH   | `/api/products/:id`                  | empty body           | 400      |
| PATCH   | `/api/products/999`                  | missing resource     | 404      |
| PUT     | `/api/products/:id`                  | valid full replace   | 200      |
| PUT     | `/api/products/:id`                  | missing fields       | 400      |
| PUT     | `/api/products/999`                  | missing resource     | 404      |
| DELETE  | `/api/products/:id`                  | valid delete         | 200      |
| DELETE  | `/api/products/999`                  | missing resource     | 404      |
| OPTIONS | `/api/products`                      | CORS preflight       | 204      |

## Reading logs to debug

The `requestLogger` middleware prints every request to the terminal running the server:

```
[2026-08-13T10:15:22.123Z] POST /api/products
```

The `errorHandler` middleware additionally logs the failing method, path, and error message whenever something goes wrong:

```
[ERROR] PATCH /api/products/999 -> Product 999 not found
```

When debugging, check the terminal output alongside the Postman response — the timestamp and status code should line up with what you see in Postman's response panel.
