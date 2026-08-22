# Watchlist

A full MERN stack app for tracking movies you want to watch and movies
you've already seen. Register, log in, and manage your own private
watchlist — full CRUD, backed by MongoDB, protected by JWT on both the
front-end and back-end, deployed and live.

## Tech Stack

**Client** — React 18, Vite, React Router, Axios
**Server** — Node.js, Express 5 (deployed as a Vercel serverless function), MongoDB Atlas, Mongoose, JWT, bcryptjs

## Features

- Register and log in with a bcrypt-hashed password and a signed JWT
- Session persists across page reloads (JWT stored in `localStorage`)
- Protected routes on **both** ends: the front-end redirects to `/login` if there's no valid session, and the back-end independently verifies the JWT on every request — the front-end check is for UX, the back-end check is what actually protects the data
- Full CRUD on movies: add, view, edit (mark watched/unwatched, rate, add notes), delete
- Filter your list by status (`to-watch` / `watched`) via a real API query parameter
- Movies are scoped per user — one account can never see another's list
- Loading and error states surfaced in the UI for every network call

## Project Structure

```
day30-movie-watchlist/
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx      # token/user state + localStorage persistence
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx         # front-end route protection
│   │   │   ├── AuthForm.jsx
│   │   │   ├── MovieForm.jsx
│   │   │   └── MovieList.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── MoviesPage.jsx
│   │   ├── App.jsx                        # route definitions
│   │   ├── main.jsx
│   │   └── api.js
│   └── ...
│
├── server/
│   ├── api/index.js                       # Vercel serverless entry point
│   ├── app.js                               # the Express app itself
│   ├── server.js                             # LOCAL DEV ONLY (app.listen)
│   ├── db.js                                  # Mongoose connection, cached for serverless reuse
│   ├── routes/
│   │   ├── auth.js
│   │   └── movies.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── moviesController.js
│   ├── middleware/
│   │   ├── requireAuth.js                       # JWT verification — back-end route protection
│   │   ├── validateAuth.js
│   │   ├── validateMovie.js
│   │   ├── requestLogger.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Movie.js
│   └── ...
│
└── README.md
```

## How to Run Locally

**Server**
```bash
cd server
npm install
cp .env.example .env
# fill in your own values — see Environment Variables below
npm run dev
```
Runs at `http://localhost:3000`.

**Client** (in a second terminal)
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open the URL Vite prints, typically `http://localhost:5173`.

## Environment Variables

**`server/.env`**
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN` — comma-separated list of allowed origins
- `MONGODB_URI`
- `JWT_SECRET` — generate a real one with `node generate-secret.js`, never use a placeholder
- `JWT_EXPIRES_IN`

**`client/.env`**
- `VITE_API_URL`

## API Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account, returns a JWT |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| GET | `/api/auth/me` | Yes | Get the logged-in user's profile |
| GET | `/api/movies` | Yes | List your movies (supports `?status=` and `?genre=`) |
| GET | `/api/movies/:id` | Yes | Get one movie |
| POST | `/api/movies` | Yes | Add a movie |
| PUT | `/api/movies/:id` | Yes | Replace a movie |
| PATCH | `/api/movies/:id` | Yes | Partially update a movie |
| DELETE | `/api/movies/:id` | Yes | Delete a movie |

## Data Model / Schemas

**User**
| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `passwordHash` | String | required, `select: false` — never returned by default |

**Movie**
| Field | Type | Notes |
|---|---|---|
| `title` | String | required |
| `genre` | String | optional |
| `status` | String | `to-watch` or `watched`; defaults to `to-watch` |
| `rating` | Number | 1–5, optional |
| `notes` | String | optional |
| `user` | ObjectId | required, references `User` |
| `createdAt` / `updatedAt` | Date | automatic |

## Deployment

Deployed as **two separate Vercel projects** from this one repo — the API as a serverless function, the client as a static Vite build.

### 1. Database — MongoDB Atlas
Network Access → allow `0.0.0.0/0` (serverless functions don't have a fixed IP).

### 2. API — Vercel
1. Push this repo to GitHub
2. Vercel → **Add New → Project** → import the repo → Root Directory = `server`
3. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`
4. Deploy → confirm `https://your-api.vercel.app/health` returns `{"success":true,"status":"ok"}`

### 3. Client — Vercel (second project)
1. Vercel → **Add New → Project** → import the **same repo again** → Root Directory = `client`
2. Add environment variable: `VITE_API_URL` = your API URL from step 2
3. Deploy

### 4. Close the loop
Go back to the **server** project → Settings → Environment Variables → update `CORS_ORIGIN` to include your real client URL → redeploy. Without this, the deployed client's requests will fail with a CORS error.

## Live URLs

- Frontend: _add your deployed client URL here_
- Backend: _add your deployed API URL here_

## Testing

Import `server/postman_collection.json` into Postman — covers Auth (register/login), Movies Happy Paths (full CRUD lifecycle with auto-captured `{{token}}`/`{{movieId}}`), and Movies Error Paths (no token, missing fields, invalid rating, bad id, not found, empty PATCH body).

## Confirming It Works End-to-End (for your demo)

1. Register a new account
2. Add 2–3 movies with different statuses
3. Filter by "To watch" — confirm only matching movies show
4. Mark one "watched," add a rating
5. Refresh the page — confirm you're still logged in
6. Delete a movie — confirm it disappears from both the UI and Atlas
7. Log out, try visiting `/movies` directly — confirm you're redirected to `/login`

## Known Limitations

- No refresh-token flow — once the JWT expires, you have to log in again
- First request after inactivity may be slower (serverless cold start)
- No pagination — all of a user's movies load in one request

## Future Improvements

- Poster images via a free movie API (e.g. OMDb) instead of manual entry
- Sort by rating or date added
- Edit-in-place UI instead of relying only on the "mark watched" quick action
