# Day 20 — RESTful CRUD API Design

A full CRUD API for a **Products** resource, built the REST way, with routes and
controllers kept in separate files (as required by today's task).

## Project structure

```
day20-crud-api/
├── server.js                     # app setup, middleware, mounts the router
├── routes/
│   └── products.js                # ONLY maps verb + path -> controller function
├── controllers/
│   └── productsController.js       # actual handler logic lives here
├── data/
│   └── products.js                  # in-memory "database"
├── nodemon.json
├── package.json
└── .gitignore
```

This route/controller split is the main new structural idea from today: routes stay
thin (just wiring), controllers hold the logic.

## Setup

```bash
cd day20-crud-api
npm install
```

## Run

```bash
npm run dev     # nodemon, auto-reloads on changes
# or
npm start
```

Server runs at **http://localhost:3000**.

## REST conventions used

| Verb   | Path                | Meaning                      |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/products`     | list resource collection     |
| GET    | `/api/products/:id` | read a single resource       |
| POST   | `/api/products`     | create a new resource        |
| PUT    | `/api/products/:id` | full replace of a resource   |
| PATCH  | `/api/products/:id` | partial update of a resource |
| DELETE | `/api/products/:id` | remove a resource            |

## Status codes

- **200 OK** — successful GET / PUT / PATCH / DELETE
- **201 Created** — successful POST
- **400 Bad Request** — missing/invalid fields (e.g. no `name`, non-numeric `price`, bad `id`)
- **404 Not Found** — unknown route, or product `id` doesn't exist
- **500 Internal Server Error** — unexpected failure (caught by error middleware)

## Testing with Postman

Create these requests and screenshot the response panel for each:

1. `GET http://localhost:3000/api/products` → 200, full list
2. `GET http://localhost:3000/api/products?category=electronics` → 200, filtered (query param)
3. `GET http://localhost:3000/api/products/2` → 200, single product (URL param)
4. `GET http://localhost:3000/api/products/999` → 404
5. `POST http://localhost:3000/api/products` — Body → raw → JSON:
   ```json
   { "name": "USB-C Hub", "price": 2200, "category": "electronics" }
   ```
   → 201, created product with new `id`
6. `PATCH http://localhost:3000/api/products/1` — body `{ "price": 1400 }` → 200
7. `PUT http://localhost:3000/api/products/3` — body:
   ```json
   { "name": "Spiral Notebook", "price": 200, "category": "stationery" }
   ```
   → 200
8. `DELETE http://localhost:3000/api/products/3` → 200
9. `DELETE http://localhost:3000/api/products/3` again → 404 (already deleted, proves the check works)

## curl reference

```bash
curl http://localhost:3000/api/products
curl "http://localhost:3000/api/products?category=electronics"
curl http://localhost:3000/api/products/2
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"USB-C Hub","price":2200,"category":"electronics"}'
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":1400}'
curl -X DELETE http://localhost:3000/api/products/3
```
