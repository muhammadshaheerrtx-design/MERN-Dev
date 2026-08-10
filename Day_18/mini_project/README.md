# Cyber Intel — Threat Intelligence SPA

A 5-page React Single Page Application that consumes and visualizes CISA's Known Exploited Vulnerabilities (KEV) dataset.

## Features & Routes

- `/` — **Dashboard:** High-level metrics, targeted vendors, and recently added threats.
- `/vulnerabilities` — **CVE Catalog:** Full dataset with live text search, vendor filtering, and date sorting.
- `/vulnerability/:cveId` — **Threat Details:** Dynamic parametric view for inspecting specific CVE remediation info and patch links.
- `/ransomware` — **Ransomware Watchlist:** Dedicated filter showing vulnerabilities leveraged in ransomware campaigns.
- `/about` — **Compliance Info:** Background on Federal Directive BOD 22-01 and system architecture.
- `*` — **404 Page:** Route fallback handling.

## Tech Stack

- **Frontend:** React 18, Vite
- **Routing:** React Router DOM v6
- **State Management:** React Context API
- **Styling:** CSS3 (CSS Grid & Flexbox, Dark Theme)

## Project Structure

```text
cyber-intel/
├── public/
│   └── cisa.json
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx
│   │   ├── MetricCard.jsx
│   │   ├── Navbar.jsx
│   │   └── VulnerabilityCard.jsx
│   ├── context/
│   │   └── VulnerabilityContext.jsx
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── RansomwareWatchPage.jsx
│   │   ├── VulnerabilityDetailPage.jsx
│   │   └── VulnerabilityListPage.jsx
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Getting Started

Clone the repository:

Bash
git clone <your-repository-url>
cd cyber-intel
Install dependencies:

Bash
npm install
Run development server:

Bash
npm run dev
Open http://localhost:5173 in your browser.
