# Taskline

A full-stack task tracker with end-to-end authentication, deployed
entirely on Vercel — the React client as a static site, and the Express
API as a serverless function. MongoDB stays on Atlas.

## What's different about this deployment

The task originally called for the API to run on Render (a traditional
always-on Node host). Render now requires card verification to create a
new web service even on its free instance type, so this project instead
deploys the API to **Vercel as a serverless function** — no card
required, and it's the same platform already hosting the client.

**This is still a real Express app.** Nothing about how the routes,
controllers, middleware, or Mongoose models are written changed. The
only difference is *how it's run*: instead of calling `app.listen()` and
holding a process open forever, the Express app is exported and Vercel's
runtime calls it directly per request, spinning up a short-lived
execution context each time rather than one long-running server.

## Project structure

```
day29-deployed-app/
├── client/                       # React + Vite — deployed as a static site
│   └── ...(unchanged from before)
│
├── server/
│   ├── api/
│   │   └── index.js                 # the ONLY file Vercel actually runs
│   ├── app.js                        # the Express app itself — no app.listen()
│   ├── server.js                      # LOCAL DEV ONLY — calls app.listen()
│   ├── db.js                           # connection caching for serverless reuse
│   ├── vercel.json                      # routes every path to the one function
│   └── ...(routes/controllers/models/middleware, unchanged)
│
└── README.md
```

## Key implementation detail: connection caching

Serverless functions can be invoked repeatedly in quick succession, each
potentially in a fresh execution context. Without caching, every request
would call `mongoose.connect()` again — slow, and it can exhaust Atlas's
connection limit fast. `db.js` caches the connection (and any in-flight
connection promise) on Node's `global` object, so a warm function
instance reuses the existing connection instead of reconnecting:

```js
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

`app.js` calls `connectDB()` as middleware on every request — cheap when
already connected, since it just returns the cached connection.

## How to Run Locally

**Server** — unchanged, still a normal Express dev server:
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**Client** — unchanged:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

**`server/.env`**
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

**`client/.env`**
- `VITE_API_URL`

## Deployment — both on Vercel

### 1. Database — Atlas
Network Access → allow `0.0.0.0/0`, since serverless functions don't run
from a fixed IP.

### 2. API — Vercel (as a separate project from the client)

1. Push this repo to GitHub
2. Vercel dashboard → **Add New → Project** → import the repo
3. Set **Root Directory** to `server`
4. Vercel auto-detects `api/index.js` as a serverless function — no build command needed for the API itself
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`. Leave `CORS_ORIGIN` for now.
6. Deploy. Vercel gives you a URL like `https://taskline-server.vercel.app`
7. Confirm it's alive: visit `https://taskline-server.vercel.app/health` → should return `{"success":true,"status":"ok"}`

### 3. Client — Vercel (a second, separate project)

1. Vercel dashboard → **Add New → Project** → import the **same repo again**
2. Set **Root Directory** to `client`
3. Framework preset: Vite (auto-detected)
4. Add environment variable: `VITE_API_URL` = your API URL from step 2
5. Deploy. Vercel gives you a URL like `https://taskline.vercel.app`
6. `client/vercel.json` already handles SPA routing so `/tasks` works on a direct link or refresh

### 4. Close the loop — update CORS

Go back to the **server** Vercel project → Settings → Environment
Variables → update:
```
CORS_ORIGIN=http://localhost:5173,https://taskline.vercel.app
```
Redeploy the server project for the change to take effect (Vercel:
Deployments tab → ⋮ on the latest deployment → Redeploy). Without this
step, your deployed client's requests to your deployed API will fail
with a CORS error even though both are individually live.

## Confirming the live app works end-to-end

1. Open your deployed client URL
2. Register a new account
3. Create a task, confirm it appears
4. Refresh the page — you should still be logged in (localStorage persistence)
5. Open the `tasks` collection in Atlas — confirm the document is really there
6. Delete the task, confirm it disappears both in the UI and in Atlas
7. Log out, then try visiting `/tasks` directly in the URL bar — you should be redirected to `/login`

## Cold starts on serverless

Vercel's free-tier serverless functions also have a form of cold start —
if a function hasn't been invoked recently, the first request after a
period of inactivity takes a bit longer while a new execution context
spins up and the database connection is established. This is the same
underlying trade-off the original Render plan would have had, just
described differently: "sleeping instance" vs. "cold function start."
Subsequent requests are fast since the warm instance and cached DB
connection get reused.

## Live URLs

- Frontend: _add your deployed client URL here_
- Backend: _add your deployed API URL here_

## Known Limitations

- No refresh-token flow — once the JWT expires, the user has to log in again
- First request after inactivity is slower (serverless cold start)
- No CI/CD beyond Vercel's own git-push-to-deploy
- Two separate Vercel projects (client + server) from one repo, rather than one unified deployment — a minor extra step during setup, but no different operationally once both are live

## Future Improvements

- Add a refresh-token flow
- Add an edit-task UI using the existing PUT/PATCH endpoints
- Add automated tests and a CI pipeline
- Add pagination for large task lists
