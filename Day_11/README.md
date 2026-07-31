# Day 11 — Node.js, npm & the Git/GitHub Workflow

**Petalnex Pvt. Ltd. — MERN Stack Internship — Week 2, Day 11**
**Intern:** Muhammad Shaheer

## What this is

A minimal Node.js project set up to practice the real day-to-day tooling
workflow: `npm init`, installing and using a third-party package,
`.gitignore`, and a proper feature-branch → commits → pull request flow.

## What it does

Running the script prints a styled banner and some environment info to
the console, using:
- **chalk** (npm package) — for colored terminal output
- **os** and **process** (Node built-in modules) — for platform, CPU, and
  working-directory info

## Tech stack

- Node.js (CommonJS: `require` / `module.exports`)
- npm package: [`chalk`](https://www.npmjs.com/package/chalk) (v4, CommonJS-compatible)

## Project structure

```
day11-node-npm-git/
├── index.js         # main script — uses chalk + os/process
├── package.json     # npm metadata + start script
├── package-lock.json
├── .gitignore        # node_modules, .env, logs, editor/OS files
└── README.md
```

## How to run

```bash
npm install   # installs chalk from package.json
npm start     # runs index.js
```

## Git workflow used

```bash
git checkout -b feature/day-11-node-npm-git

git add package.json package-lock.json .gitignore
git commit -m "chore: initialize Node project with npm and add .gitignore"

git add index.js
git commit -m "feat: add index.js using chalk to log a styled environment banner"

git add README.md
git commit -m "docs: add README explaining the Day 11 task and setup"

git push -u origin feature/day-11-node-npm-git
# then opened a Pull Request from feature/day-11-node-npm-git into main
```

## Notes

- `node_modules/` and any `.env` file are excluded via `.gitignore` and
  were never committed.
- `package-lock.json` **is** committed (that's correct practice — it
  locks exact dependency versions for anyone who clones the repo).
