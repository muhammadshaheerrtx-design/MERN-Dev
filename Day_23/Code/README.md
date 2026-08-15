# Day 23 — Authentication: JWT & Password Hashing

Register → Login → Protected route flow, exactly as scoped by today's task
(the full Tasks resource with CRUD was added the next day as the Week 4
assignment, built directly on top of this auth layer).

## Project structure

```
day23-auth-api/
├── server.js
├── routes/
│   └── auth.js               # register, login, one protected route (/me)
├── controllers/
│   └── authController.js       # hashing, JWT signing, verification logic
├── middleware/
│   ├── requireAuth.js            # verifies JWT, attaches req.user
│   ├── validateAuth.js
│   ├── requestLogger.js
│   ├── notFound.js
│   └── errorHandler.js
├── models/
│   └── User.js                    # in-memory, stores password HASH only
├── utils/
│   └── response.js                  # standardized success/error JSON shape
├── postman_collection.json
└── .env / .env.example
```

## Setup

```bash
cd day23-auth-api
npm install
cp .env.example .env
npm run dev
```

Server runs at **http://localhost:3000**.

## The flow

**1. Register — `POST /api/auth/register`**
Body: `{ "name", "email", "password" }`
The password is hashed with bcrypt (`bcrypt.hash(password, 10)`) before being stored — the plaintext password is never saved anywhere. Returns a signed JWT immediately.

**2. Login — `POST /api/auth/login`**
Body: `{ "email", "password" }`
Looks up the user by email, then verifies the submitted password against the stored hash with `bcrypt.compare()`. Returns a signed JWT on success. On failure (wrong email OR wrong password), returns the same generic 401 message so the API doesn't reveal which one was wrong.

**3. Protected route — `GET /api/auth/me`**
Requires `Authorization: Bearer <token>`. The `requireAuth` middleware:
- Reads the token from the header
- Verifies it with `jwt.verify()` against `JWT_SECRET`
- Looks up the user by the id encoded in the token
- Attaches the user to `req.user` and calls `next()`

If any step fails (missing header, invalid token, expired token, user no longer exists), it responds with `401` and the route handler never runs.

## Status codes

- **201** — successful register
- **200** — successful login / successful `/me`
- **400** — validation failure (missing fields, invalid email format, password under 6 chars, duplicate email)
- **401** — wrong credentials, missing token, invalid token, expired token

## Security hygiene

- `JWT_SECRET` lives in `.env` (gitignored) — never hardcoded, never committed
- `.env.example` documents the required variables without exposing a real secret
- Passwords are hashed with bcrypt, never stored or returned in plaintext
- `passwordHash` is stripped from every user object before it's sent to the client
- Login gives a generic error for both "no such user" and "wrong password" to avoid leaking which emails are registered

## Testing with Postman

Import `postman_collection.json`. Run in this order:

1. **Register** (or **Login**, if already registered) — auto-captures the JWT into `{{token}}`
2. **Register (duplicate email)** → 400
3. **Register (weak password)** → 400
4. **Login (wrong password)** → 401
5. **GET /me (with token)** → 200 — proves the protected route works
6. **GET /me (no token)** → 401
7. **GET /me (malformed token)** → 401

## Screenshot checklist for deliverable

- Register response showing `201` and a token
- Login response showing `200` and a token
- `GET /me` with the token attached → `200` with user data
- `GET /me` with no token → `401`
