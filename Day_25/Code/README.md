# Day 25 — MongoDB & Mongoose Fundamentals

A Node script that connects to a MongoDB Atlas cluster via Mongoose and
performs create, read, update, and delete operations on a `Product`
collection.

## What you need installed

- **Node.js** (already have this from previous days)
- **Nothing else locally** — MongoDB itself is *not* installed on your machine. Atlas hosts the actual database in the cloud; your project only needs the `mongoose` npm package to talk to it.
- **MongoDB Compass** (optional, desktop app) — lets you visually browse your Atlas data. Download from mongodb.com/products/compass if you want it for the screenshot deliverable.

## Project structure

```
day25-mongo-crud/
├── crud.js              # the main script — run this
├── db.js                 # connect/disconnect helper
├── models/
│   └── Product.js          # Mongoose schema + model
├── .env.example
├── .gitignore
└── package.json
```

## Setup — from zero to running

**1. Install dependencies**
```bash
cd day25-mongo-crud
npm install
```

**2. Create your `.env` file**
```bash
cp .env.example .env
```
Open `.env` and paste your real Atlas connection string, replacing `<username>`, `<password>`, and `<cluster-address>` with your actual values from the Atlas "Connect → Drivers" screen:
```
MONGODB_URI=mongodb+srv://day25user:yourpassword@cluster0.abcde.mongodb.net/day25db?retryWrites=true&w=majority
```
Note the `/day25db` right after the cluster address — that's the database name. You can name it anything; Mongoose/MongoDB creates it automatically the first time you write data, no manual step needed.

**3. Confirm `.env` is gitignored**
Already handled — check `.gitignore` has `.env` in it before you ever run `git add .`. If you accidentally commit your real connection string (with password in it), rotate that database user's password immediately in Atlas.

**4. Run the script**
```bash
npm run crud
# or
node crud.js
```

## What the script actually does, in order

1. **Connects** to Atlas using the URI from `.env`
2. **CREATE** — clears any old data, then inserts 4 products with `Product.insertMany()`
3. **READ** — fetches all products, then a filtered query (`category: "electronics"`), then a single document with `findOne()`
4. **UPDATE** — finds the "Notebook" product and updates its price using `findOneAndUpdate()`
5. **DELETE** — removes the "Desk Lamp" product with `deleteOne()`
6. Prints the final remaining documents, sorted by price
7. **Disconnects** cleanly

You can re-run this script as many times as you want — it clears old data at the start of each run, so it's idempotent.

## Verifying in Atlas / Compass

**Via Atlas web UI:**
1. Go to your cluster → **Browse Collections**
2. You should see a `day25db` database with a `products` collection
3. Click into it to see the actual documents, each with an auto-generated `_id`, your fields, and `createdAt`/`updatedAt` timestamps (from the `timestamps: true` schema option)

**Via Compass:**
1. Open Compass, paste the same connection string from `.env`, click Connect
2. Navigate to `day25db` → `products` in the left sidebar
3. Screenshot this view for your deliverable — it should show the 3 remaining documents (Wireless Mouse, Mechanical Keyboard, and the updated Notebook at price 200) after Desk Lamp was deleted

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `MongooseServerSelectionError` | IP not allowlisted, or wrong password | Check Atlas Network Access includes your IP (or 0.0.0.0/0); double check password in the URI |
| `Authentication failed` | Wrong username/password in URI | Re-check the database user credentials in Atlas → Database Access |
| `MONGODB_URI is not set in .env` | `.env` missing or not in project root | Confirm `.env` exists next to `package.json`, not inside a subfolder |
| Special characters in password breaking the URI | `@`, `#`, `%`, `/` in the password | URL-encode them, or simplest: create a new database user with only letters/numbers |
