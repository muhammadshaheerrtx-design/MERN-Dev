# Taskline

A full-stack task tracker with end-to-end authentication, deployable to
the cloud. Register or log in, stay logged in across page reloads, and
manage your own tasks — protected both by the backend (JWT verification)
and the frontend (route protection redirects you to login if you're not
authenticated).

## What's new since Day 28

- **JWT persistence** — the token and user are saved to `localStorage` on login and restored automatically on page load, instead of being lost on refresh
- **Real protected routing** — added `react-router-dom`; `/tasks` is wrapped in a `ProtectedRoute` component that redirects to `/login` if there's no valid session, rather than the whole app being one conditional screen
- **`AuthContext`** — centralizes auth state (token, user, login, logout) so any component can access it via `useAuth()` instead of passing props down manually
- **CORS now supports multiple origins** — `CORS_ORIGIN` accepts a comma-separated list, so the same deployed API can accept requests from both your local dev client and the deployed one
- **Deployment config committed to the repo** — `server/render.yaml`, `client/vercel.json`, `client/netlify.toml`

## Tech Stack

**Client** — React 18, Vite, React Router, Axios
**Server** — Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, bcryptjs

## Project Structure

```
day29-deployed-app/
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx     # token/user state + localStorage
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx        # redirects to /login if unauthenticated
│   │   │   ├── AuthForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── App.jsx                        # route definitions
│   │   ├── main.jsx                        # wraps App in BrowserRouter + AuthProvider
│   │   └── api.js
│   ├── vercel.json                          # SPA rewrite for Vercel
│   ├── netlify.toml                          # SPA redirect for Netlify
│   └── .env.example
│
├── server/
│   ├── render.yaml                          # Render deploy config
│   └── ...(routes/controllers/models/middleware, unchanged from Day 27)
│
└── README.md
```

## How JWT persistence works

`AuthContext.jsx` reads `localStorage` synchronously when the app first
loads:
```js
const [token, setToken] = useState(() => localStorage.getItem("taskline_token"));
```
On login, the token is written to `localStorage` and axios's default
header is updated so every future request carries it automatically. On
logout, both are cleared. This means refreshing the page, or closing and
reopening the tab, keeps you logged in until the token actually expires
server-side (`JWT_EXPIRES_IN` in `server/.env`).

## How route protection works

```jsx
<Route
  path="/tasks"
  element={
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  }
/>
```
`ProtectedRoute` checks `isAuthenticated` from `AuthContext` and renders
`<Navigate to="/login" />` instead of the page if there's no token. This
is enforced independently of the backend's own `requireAuth` middleware —
the frontend check is purely for UX (don't show a broken page), while the
backend check is what actually protects the data.

## How to Run Locally

Same as Day 28 — nothing changed here.

**Server**
```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

**Client**
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
- `CORS_ORIGIN` — comma-separated list of allowed origins in production, e.g. `http://localhost:5173,https://taskline.vercel.app`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

**`client/.env`**
- `VITE_API_URL`

## Deployment

### 1. Database — already on Atlas
No change needed; make sure Network Access allows connections from
anywhere (`0.0.0.0/0`), since Render's servers don't have a fixed IP on
the free tier.

### 2. API — Render

1. Push this repo to GitHub
2. Render dashboard → **New → Web Service** → connect the repo
3. Since the repo has both `client/` and `server/`, set **Root Directory** to `server`
4. Build Command: `npm install` — Start Command: `npm start`
5. Add environment variables in the Render dashboard (Settings → Environment): `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`. Leave `CORS_ORIGIN` for now — you'll set it after step 3 below.
6. Deploy. Render gives you a URL like `https://taskline-server.onrender.com`
7. Confirm it's alive: visit `https://taskline-server.onrender.com/health` — should return `{"success":true,"status":"ok"}`

(`server/render.yaml` documents these exact settings if you prefer Render's Blueprint flow instead of manual setup.)

### 3. Client — Vercel or Netlify

**Vercel**
1. Vercel dashboard → **Add New → Project** → import the repo
2. Set **Root Directory** to `client`
3. Framework preset: Vite (auto-detected)
4. Add environment variable: `VITE_API_URL` = your Render URL from step 2 (e.g. `https://taskline-server.onrender.com`)
5. Deploy. Vercel gives you a URL like `https://taskline.vercel.app`
6. `vercel.json` in `client/` already handles SPA routing so `/tasks` works on a direct link or refresh, not just via in-app navigation

**Netlify** (alternative)
1. Netlify dashboard → **Add new site → Import an existing project**
2. Base directory: `client`
3. Build command / publish directory are already set via `netlify.toml` (`npm run build` / `dist`)
4. Add environment variable: `VITE_API_URL` = your Render URL
5. Deploy

### 4. Close the loop — update CORS

Now that you have your real client URL, go back to Render → your service →
Environment → set:
```
CORS_ORIGIN=http://localhost:5173,https://taskline.vercel.app
```
Redeploy the API (Render redeploys automatically when you save env var
changes). This is the step that actually lets your deployed browser app
talk to your deployed API — without it, every request will fail with a
CORS error even though both services are individually "up."

## Confirming the live app works end-to-end

1. Open your deployed client URL
2. Register a new account
3. Create a task, confirm it appears
4. Refresh the page — you should still be logged in (localStorage persistence)
5. Open the `tasks` collection in Atlas — confirm the document is really there
6. Delete the task, confirm it disappears both in the UI and in Atlas
7. Log out, then try visiting `/tasks` directly in the URL bar — you should be redirected to `/login`, proving route protection works

## Mind the free-tier cold start

Render's free tier spins the server down after a period of inactivity.
The **first** request after it's been idle can take 30–60+ seconds to
respond while the instance wakes back up — this is expected, not a bug.
If your first login/register attempt after some idle time seems to hang,
wait a bit before assuming something is broken; check `/health` directly
in a browser tab to watch for the moment it responds.

## Live URLs

- Frontend: _add your deployed Vercel/Netlify URL here_
- Backend: _add your deployed Render URL here_

## Known Limitations

- No refresh-token flow — once the JWT expires, the user has to log in again rather than being silently re-authenticated
- Free-tier cold starts on Render can make the first request after inactivity noticeably slow
- No CI/CD pipeline — deploys are triggered manually via git push to the connected branch

## Future Improvements

- Add a refresh-token flow so sessions can last longer without re-login
- Add an edit-task UI using the existing PUT/PATCH endpoints
- Add automated tests and a CI pipeline
- Add pagination for large task lists
