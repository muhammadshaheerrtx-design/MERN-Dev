# Day 13 — React & Vite: Game Release Cards

A simple React app built with Vite that demonstrates components, JSX, and props by rendering a list of games releasing in 2026.

## What This Project Covers

- Scaffolding a React project with Vite
- Building reusable components with JSX
- Passing data between components using props
- Rendering lists with `.map()` and unique `key` props
- Using environment variables with `import.meta.env` (VITE\_ prefix)
- Basic CSS layout with Flexbox

## Project Structure

src/
├── assets/ # Game images
├── components/
│ └── Card.jsx # Reusable card component
├── data/
│ └── items.js # Game data (title, description, image)
├── App.jsx # Renders list of Card components
├── App.css # Styling
├── main.jsx # App entry point
└── index.css

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/muhammadshaheerrtx-design/MERN-Dev.git
cd MERN-Dev/Day_13
npm install
```

Run the dev server:

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Environment Variables

This project uses a `.env` file with the `VITE_` prefix to expose a sample environment variable:

VITE_APP_NAME=Day13CardApp

Accessed in code via `import.meta.env.VITE_APP_NAME`.

## Tech Stack

- React
- Vite
- JavaScript (ES Modules)
- CSS

## Author

Muhammad Shaheer — MERN Stack Intern @ Petalnex Pvt. Ltd.
