import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar-container">
      <div className="nav-brand">
        <span className="brand-icon">🛡️</span>
        <div className="brand-text">
          <span className="brand-title">CYBER INTEL</span>
          <span className="brand-subtitle">CISA Threat Feed</span>
        </div>
      </div>
      <nav className="nav-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/vulnerabilities"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          CVE Catalog
        </NavLink>
        <NavLink
          to="/ransomware"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Ransomware Watch
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Compliance & About
        </NavLink>
      </nav>
    </header>
  );
}
