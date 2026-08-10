# Day 19 — Node & Express Fundamentals

A small in-memory "Users" API built with Express 5 to practice routes, `req`/`res`,
URL params, query params, and status codes.

## Project structure

```
day19-express-api/
├── server.js          # entry point: middleware, routes mounted, error handling
├── routes/
│   └── users.js        # all /api/users route handlers
├── data/
│   └── users.js         # in-memory "database" (array + helper functions)
├── nodemon.json
├── package.json
└── .gitignore
```

## Setup

```bash
cd day19-express-api
npm install
```

## Run

```bash
npm run dev     # nodemon, auto-reloads on file changes
# or
npm start        # plain node, no auto-reload
```

Server runs at **http://localhost:3000**.

## Endpoints

| Method | Path                     | Description                              | Success | Error |
|--------|--------------------------|-------------------------------------------|---------|-------|
| GET    | `/`                      | Welcome + list of endpoints               | 200     | —     |
| GET    | `/health`                | Health check                              | 200     | —     |
| GET    | `/api/users`             | List all users                            | 200     | —     |
| GET    | `/api/users?role=admin`  | Filter by **query param** `role`          | 200     | —     |
| GET    | `/api/users/:id`         | Get one user by **URL param** `id`        | 200     | 400 (bad id), 404 (not found) |
| POST   | `/api/users`             | Create a user (body: `name`, `email`, `role`) | 201 | 400 (missing fields) |
| PUT    | `/api/users/:id`         | Full replace (body: `name`, `email`, `role`)  | 200 | 400, 404 |
| PATCH  | `/api/users/:id`         | Partial update (any subset of fields)     | 200     | 400 (empty body), 404 |
| DELETE | `/api/users/:id`         | Delete a user                             | 200     | 404 |
| any    | unmatched route          | Falls through to 404 handler              | —       | 404 |

## Status codes used and why

- **200 OK** — successful GET/PUT/PATCH/DELETE
- **201 Created** — successful POST that creates a new resource
- **400 Bad Request** — client sent invalid/missing data (bad `id`, missing required fields)
- **404 Not Found** — route doesn't exist, or resource `id` doesn't exist
- **500 Internal Server Error** — unexpected server-side failure (caught by the
  error-handling middleware at the bottom of `server.js`)

## Testing with Postman / Thunder Client

For your deliverable, capture a screenshot of the request + response panel for each of these:

1. `GET http://localhost:3000/api/users` → 200, full list
2. `GET http://localhost:3000/api/users?role=admin` → 200, filtered list (query param)
3. `GET http://localhost:3000/api/users/2` → 200, single user (URL param)
4. `GET http://localhost:3000/api/users/999` → 404, not found
5. `POST http://localhost:3000/api/users` with JSON body:
   ```json
   { "name": "Hina Malik", "email": "hina@example.com", "role": "user" }
   ```
   → 201, created user with new `id`
6. `PATCH http://localhost:3000/api/users/1` with body `{ "role": "manager" }` → 200, updated user
7. `DELETE http://localhost:3000/api/users/3` → 200, deletion confirmed

For POST/PUT/PATCH in Postman/Thunder Client: set method + URL, go to the **Body** tab,
choose **raw → JSON**, paste the JSON, then hit Send. Make sure `Content-Type: application/json`
is set (Postman/Thunder Client do this automatically when you pick "JSON" as the body type).

## Quick curl reference (if you don't have Postman handy)

```bash
curl http://localhost:3000/api/users
curl "http://localhost:3000/api/users?role=admin"
curl http://localhost:3000/api/users/2
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Hina Malik","email":"hina@example.com","role":"user"}'
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"role":"manager"}'
curl -X DELETE http://localhost:3000/api/users/3
```
