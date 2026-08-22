# Day 24 — Week 4 Assignment: Tasks REST API with JWT Auth

A complete, tested, secured Express API: full CRUD on a **Tasks** resource,
with user registration/login, bcrypt-hashed passwords, JWT authentication,
and every task route protected — each user only sees their own tasks.

## Project structure

```
day24-tasks-auth-api/
├── server.js
├── routes/
│   ├── auth.js                 # /api/auth/register, /login, /me
│   └── tasks.js                 # /api/tasks — all routes behind requireAuth
├── controllers/
│   ├── authController.js
│   └── tasksController.js
├── middleware/
│   ├── requireAuth.js            # verifies JWT, attaches req.user
│   ├── validateAuth.js
│   ├── validateTask.js
│   ├── requestLogger.js
│   ├── notFound.js
│   └── errorHandler.js
├── models/
│   ├── User.js                    # in-memory, stores password HASH only
│   └── Task.js                     # in-memory, every task scoped to a userId
├── utils/
│   └── response.js                  # sendSuccess/sendError — standard JSON shape
├── postman_collection.json
├── .env / .env.example
└── package.json
```

## Setup

```bash
cd day24-tasks-auth-api
npm install
cp .env.example .env
npm run dev
```

Server runs at **http://localhost:3000**.

## Auth flow

1. **`POST /api/auth/register`** — `{ name, email, password }`. Password is hashed with bcrypt (10 salt rounds) before being stored — the plain password is never saved. Returns a JWT immediately so the user is logged in right after registering.
2. **`POST /api/auth/login`** — `{ email, password }`. Verifies the password against the stored hash with `bcrypt.compare`. Returns a JWT on success.
3. **`GET /api/auth/me`** — protected route, returns the logged-in user's profile. Exists specifically to demonstrate that `requireAuth` middleware works.
4. **`/api/tasks/*`** — every route requires `Authorization: Bearer <token>`. The `requireAuth` middleware verifies the token, looks up the user, and attaches it as `req.user`. Every task read/write is scoped to `req.user.id`, so one user can never see or modify another user's tasks.

JWTs are signed with `JWT_SECRET` from `.env` and expire after `JWT_EXPIRES_IN` (default 1 hour).

## Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account, returns token |
| POST | `/api/auth/login` | No | Log in, returns token |
| GET | `/api/auth/me` | Yes | Get current user's profile |
| GET | `/api/tasks` | Yes | List own tasks (supports `?status=`) |
| GET | `/api/tasks/:id` | Yes | Get one task |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Full replace |
| PATCH | `/api/tasks/:id` | Yes | Partial update |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

## Status codes

- **200 / 201** — success
- **400** — validation failure (missing/invalid fields, bad `id`, duplicate email)
- **401** — missing/invalid/expired token, or wrong login credentials
- **404** — task not found (or belongs to a different user — same response either way, so ownership isn't leaked)
- **500** — unexpected server error, caught by centralized error handler

## Response shape

Every endpoint returns one of two shapes (enforced via `utils/response.js`):
```json
{ "success": true, "data": {...} }
{ "success": false, "error": "message", "details": ["optional array"] }
```

## Testing with Postman

Import `postman_collection.json`. It's organized into four folders:

1. **Auth** — register (+ duplicate/weak-password error cases), login (+ wrong password), `/me` with and without a token. The register/login requests auto-capture the returned JWT into a `{{token}}` collection variable.
2. **Tasks - Happy Paths** — full CRUD lifecycle using `{{token}}`, auto-capturing `{{taskId}}` from the create response so later requests operate on the right task.
3. **Tasks - Error Paths** — no token, malformed token, missing fields, invalid status, bad id, not-found, empty PATCH body.
4. **CORS** — manual preflight check.

Run **Auth → register** first (or **login** if the user already exists) before running anything in the Tasks folders, since they depend on `{{token}}` being set.

## Security notes

- Passwords are hashed with bcrypt before storage — never stored or returned in plain text.
- `passwordHash` is stripped from every user object sent to the client (`User.toPublic`).
- Login returns the same generic "Invalid email or password" whether the email doesn't exist or the password is wrong, so an attacker can't use the API to enumerate valid emails.
- `JWT_SECRET` lives in `.env` (gitignored) — `.env.example` documents the required variable without exposing a real secret.
- Data is in-memory only, per the assignment (a real database is next week) — restarting the server clears all users and tasks.

## Demo script (for the 2–5 min video)

1. Show `GET /api/tasks` with no token → 401
2. Register a user → show token in response
3. Show `GET /api/auth/me` with that token → 200
4. Create 2–3 tasks
5. List tasks, update one (PATCH), delete one
6. Register a **second** user, show their task list is empty — proves isolation
7. Show the `.env` file (redact the actual secret if screen-recording) and mention CORS is configured via `CORS_ORIGIN`
8. Quickly show the Postman collection running end to end
