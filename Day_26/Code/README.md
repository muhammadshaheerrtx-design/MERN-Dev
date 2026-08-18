# Day 26 — Querying, Validation & Relationships

Two related collections — **User** and **Post** — connected via a Mongoose
reference (`ObjectId` + `populate`), with schema validation, timestamps,
and a script demonstrating filtering, sorting, limiting, projection, and
populating related data.

## Project structure

```
day26-mongoose-relationships/
├── models/
│   ├── User.js
│   └── Post.js
├── db.js                  # connect/disconnect helper
├── seed.js                 # clears + inserts sample users and posts
├── queries.js                #filter/sort/populate examples
├── .env.example
├── .gitignore
└── package.json
```

## The relationship

`Post.author` stores a `mongoose.Schema.Types.ObjectId` with `ref: "User"`.
This is a **referenced** relationship (as opposed to embedding the whole
user object inside every post):

```js
author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
```

**Referenced vs embedded:** we reference here because a user's
posts can grow unbounded over time, and multiple posts need to point back
to the _same_ user without duplicating their data everywhere. Embedding
makes sense for data that's small, bounded, and always accessed together
with its parent (e.g. an address embedded directly in a user document) —
referencing makes sense here because posts and users are independently
queried and posts can outnumber their author significantly.

Without `.populate()`, `post.author` is just a raw ObjectId string. With
`.populate("author", "name email")`, Mongoose runs a second query behind
the scenes and replaces that id with the actual matching User document.

## Validation + defaults + timestamps

- `User.email` — required, unique (creates a unique index), validated against a regex
- `User.bio` — optional, defaults to `""` if omitted, capped at 280 characters
- `Post.title` / `Post.body` / `Post.author` — required
- `Post.published` — defaults to `false`
- Both schemas use `{ timestamps: true }`, which auto-adds and maintains `createdAt` / `updatedAt`

## Setup

```bash
cd day26-mongoose-relationships
npm install
cp .env.example .env
# paste your real Atlas connection string into .env
```

## Run

**1. Seed the database first** (clears old data, creates 3 users and 5 posts with real references):

```bash
npm run seed
```

**2. Then run the queries script** (the actual practical task deliverable):

```bash
npm run queries
```

## What `queries.js` demonstrates

| Section                         | Mongoose feature                                                                |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Filter: published posts         | `Post.find({ published: true })`                                                |
| Filter: posts by tag            | `Post.find({ tags: "mongodb" })` — querying inside an array field               |
| Sort: newest first              | `.sort({ createdAt: -1 })`                                                      |
| Limit: 2 most recent            | `.sort(...).limit(2)`                                                           |
| Projection: titles only         | `Post.find({}, "title published")` — only returns the listed fields             |
| **Populate**: posts with author | `.populate("author", "name email")` — replaces the ObjectId with real user data |
| Combined query                  | filter + sort + limit + populate chained together                               |
| Reverse lookup                  | given a User, find all Posts referencing that user's `_id`                      |
| Validation (posts)              | attempts to create a post missing `body`/`author` — rejected                    |
| Validation (users)              | attempts to create a duplicate email — rejected by the unique index             |
