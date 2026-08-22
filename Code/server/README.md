# Day 27 — Wiring Express to MongoDB

The Day 24 Tasks + JWT Auth API, rewired to use real MongoDB (Atlas) via
Mongoose instead of in-memory arrays. Every controller is now async,
connects to a real database, and handles DB-specific errors and 404s
properly.

## What changed from Day 24

| Day 24 (in-memory) | Day 27 (MongoDB) |
|---|---|
| `models/User.js` — plain array + functions | `models/User.js` — real Mongoose schema, unique email index, `select: false` on passwordHash |
| `models/Task.js` — plain array + functions | `models/Task.js` — real Mongoose schema, `user` field references `User` via ObjectId |
| ids are auto-incrementing numbers | ids are MongoDB ObjectIds (24-char hex strings) |
| controllers are synchronous | every controller function is `async`, uses `await` on Mongoose calls |
| server starts immediately | server connects to Atlas **first**, only starts listening on success |
| no DB error handling needed | `errorHandler.js` now translates `ValidationError`, `CastError`, and duplicate-key errors into clean 400s |
| `validateIdParam` checked `Number(id)` | removed — id shape validation now uses `mongoose.isValidObjectId()` inside the controller, since it's DB-specific |

## Project structure

```
day27-tasks-auth-db-api/
├── server.js                    # connects to DB, THEN starts listening
├── db.js                          # connectDB() helper
├── routes/
│   ├── auth.js
│   └── tasks.js
├── controllers/
│   ├── authController.js           # async, uses User.findOne/.create
│   └── tasksController.js           # async, uses Task.find/.create/.findOneAndUpdate/.findOneAndDelete
├── middleware/
│   ├── requireAuth.js                # now async — looks up user in DB
│   ├── validateAuth.js
│   ├── validateTask.js
│   ├── requestLogger.js
│   ├── notFound.js
│   └── errorHandler.js                # now translates Mongoose errors too
├── models/
│   ├── User.js                          # Mongoose schema
│   └── Task.js                           # Mongoose schema, references User
├── utils/
│   └── response.js
├── postman_collection.json
└── .env / .env.example
```

## Setup

```bash
cd day27-tasks-auth-db-api
npm install
cp .env.example .env
```

Edit `.env` and set your real Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/day27db?retryWrites=true&w=majority
```
(Same Atlas account/cluster from Day 25–26 works fine — just point at a fresh database name like `day27db` if you want separate data.)

## Run

```bash
npm run dev
```

If the connection fails, the server logs the error and **refuses to start** rather than accepting requests it can't actually serve:
```
MongoDB connected: day27db
Server listening on http://localhost:3000 (development mode)
```

## Key implementation details

**Connecting on startup (`db.js` + `server.js`)**
```js
async function start() {
  await connectDB();
  app.listen(PORT, ...);
}
```
This is the main "wiring" step the task asks for — the app doesn't pretend to be ready until the database connection is confirmed.

**Rewriting controllers as async (`controllers/tasksController.js`)**
Every function follows the same shape:
```js
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, tasks, { count: tasks.length });
  } catch (err) {
    next(err); // hands DB errors to the centralized error handler
  }
}
```
This is exactly why async/await from Week 2 mattered — every database operation is asynchronous, and without `await` + `try/catch`, errors would either be silently lost or crash the process.

**Handling not-found vs invalid-id vs DB error**
Three genuinely different cases, each handled distinctly:
- `id` isn't a valid ObjectId shape at all → `400` (`mongoose.isValidObjectId()` check)
- `id` is valid-shaped but no document matches (or belongs to a different user) → `404`
- Something else goes wrong (connection drop, validation failure on write) → caught by `errorHandler.js`, mapped to the right status code based on the Mongoose error type

**User isolation still holds** — every Task query includes `user: req.user._id` in its filter, so one user's tasks are invisible to another, same guarantee as Day 24, just enforced at the database query level now instead of an in-memory filter.

## Testing with Postman

Import `postman_collection.json` — same structure as Day 24 (Auth / Tasks Happy Paths / Tasks Error Paths / CORS), updated for MongoDB:
- Register/login work exactly the same from the client's point of view
- Task ids in responses are now real ObjectId strings (e.g. `"666f1f2e5a1b2c3d4e5f6789"`) instead of small integers — the `{{taskId}}` collection variable still auto-captures them correctly
- The "invalid id" error test now specifically demonstrates the `mongoose.isValidObjectId()` check
- The "not found" tests use a validly-formatted but non-existent ObjectId (`64f000000000000000000000`) to correctly exercise the 404 path rather than accidentally hitting the 400 invalid-id path

**Screenshot deliverable:** run the full Happy Paths folder, then open Atlas (or Compass) and screenshot the `tasks` collection showing real documents with `user` fields containing ObjectIds that match a document in the `users` collection — that's the proof the API is genuinely writing to and reading from the database, not just returning success responses.

## Common errors you might hit

| Error | Cause | Fix |
|---|---|---|
| `Failed to connect to MongoDB. Server not started.` | Bad URI, wrong password, IP not allowlisted | Check `.env`, check Atlas Network Access |
| `CastError` in logs / 400 "Invalid task id" | Client sent a malformed id (not 24-char hex) | Expected behavior — this is the validation working |
| `ValidationError` / 400 "Validation failed" | Required field missing or enum value invalid on a Mongoose write | Expected behavior — same as before, now enforced by the schema itself |
| `E11000 duplicate key error` in logs | Someone tried to register with an email that already exists, racing past the pre-check | Handled by `errorHandler.js`'s `err.code === 11000` branch — returns a clean 400 instead of a raw Mongo error |
