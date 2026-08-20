# Day 28 — Taskline: React + Express + MongoDB

A full-stack task tracker. React (Vite) talks to an Express + MongoDB API
over HTTP using axios — the complete loop: **React UI → axios → Express →
MongoDB → back to the UI**, with loading and error states handled at every
step.

Login/register exist only so the app can call the protected `/api/tasks`
routes built on Day 24/27 — the JWT is kept in memory for this stage.
Persisting it across page reloads and route protection is Day 29's task,
not part of this one.

## Project structure

```
day28-fullstack-app/
├── client/                     # React + Vite
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx               # orchestrates auth + task state
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── api.js                  # axios instance, reads VITE_API_URL
│   │   └── components/
│   │       ├── AuthForm.jsx
│   │       ├── TaskForm.jsx
│   │       └── TaskList.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .gitignore
│
├── server/                     # Node + Express + MongoDB (from Day 27)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## What's actually wired up

- **`client/src/api.js`** reads `import.meta.env.VITE_API_URL` — Vite only exposes env vars prefixed `VITE_` to browser code, which is why the variable is named that way rather than just `API_URL`.
- **List** — `App.jsx` calls `getTasks()` in a `useEffect` once logged in; `TaskList.jsx` renders it, showing a loading message while the request is in flight and an error banner if it fails.
- **Create** — `TaskForm.jsx` collects a title + status, `App.jsx` calls `createTask()` and prepends the result to state — no full refetch needed, but the data still round-tripped through the real API and database.
- **Delete** — each `TaskList` row has a delete button; `App.jsx` calls `deleteTask(id)` and removes it from local state on success.
- **Loading/error states** — every network call (login, register, fetch tasks, create, delete) has its own loading flag and error message shown in the UI, not just logged to the console.
- **CORS** — the server's `CORS_ORIGIN` in `server/.env` is set to `http://localhost:5173` (Vite's default port), so the browser is allowed to call it cross-origin.

## Setup — full walkthrough

**1. Server**
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env` and paste your real MongoDB Atlas connection string (same account from Day 25–27):
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/day28db?retryWrites=true&w=majority
```

**2. Client**
```bash
cd ../client
npm install
cp .env.example .env
```
`client/.env` already defaults to the right value for local dev:
```
VITE_API_URL=http://localhost:3000
```

## Run — every command, in order

Open **two terminals**.

**Terminal 1 — server:**
```bash
cd server
npm run dev
```
Wait for:
```
MongoDB connected: day28db
Server listening on http://localhost:3000 (development mode)
```

**Terminal 2 — client:**
```bash
cd client
npm run dev
```
Vite will print a local URL, typically:
```
Local:   http://localhost:5173/
```

Open that URL in your browser.

## Testing the full loop

**1. Register or log in**
- On first run, click the **Register** tab, fill in name/email/password (min 6 characters), submit
- You should land on the task screen with your email shown in the top-right
- If you get an error like "email already exists" (from a previous test), switch to the **Log in** tab instead

**2. Confirm the list loads (READ)**
- On a fresh account, you should see "No tasks yet — add your first one above."
- Open your browser's DevTools → Network tab, refresh — you should see a `GET /api/tasks` request going to `http://localhost:3000`, with an `Authorization: Bearer ...` header

**3. Create a task (CREATE)**
- Type a title, pick a status, click **Add task**
- It should appear at the top of the list immediately
- Check the Network tab: a `POST /api/tasks` request, status `201`

**4. Confirm it's really in the database**
- Open Atlas (or Compass) → Browse Collections → `day28db` → `tasks`
- You should see the document you just created, with a `user` field matching your account's `_id` in the `users` collection

**5. Delete a task (DELETE)**
- Click **Delete** next to any task
- It should disappear from the list; Network tab shows `DELETE /api/tasks/:id`, status `200`
- Refresh Atlas/Compass — the document should be gone

**6. Test the error states deliberately**
- Stop the server (Ctrl+C in Terminal 1) while the client is still open, then try adding a task — you should see a clean error message in the UI ("Network error — is the server running?"), not a blank screen or unhandled crash
- Restart the server and confirm things work again without needing to refresh the page

**7. Log out**
- Click **Log out** — you're returned to the login screen, and the in-memory token is cleared (refreshing the page also logs you out, since nothing is persisted yet — expected at this stage)

## Deliverable: recording the CRUD loop

For your submission, screen-record steps 1–5 above in one continuous take:
register/login → empty state → create a task → see it appear → open
Atlas/Compass showing the real document → delete it → see it disappear
→ confirm it's gone from Atlas too. That's the full React → axios →
Express → MongoDB → UI loop, proven end to end.

## Common issues

| Symptom | Cause | Fix |
|---|---|---|
| Blank page, console shows `VITE_API_URL is not set` | Missing `client/.env` | `cp .env.example .env` inside `client/` |
| Network tab shows requests failing with no response / CORS error | Server not running, or `CORS_ORIGIN` mismatch | Confirm server is running on port 3000; confirm `server/.env`'s `CORS_ORIGIN` matches the client's actual URL |
| "Invalid email or password" right after registering | Testing against stale data from a previous run | Use a fresh email, or log in instead of registering again |
| Tasks don't show after creating | `_id` mismatch somewhere | Confirm you're on the version of `TaskList.jsx` that keys off `task._id`, not `task.id` (MongoDB uses `_id`) |
