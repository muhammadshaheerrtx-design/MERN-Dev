import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">🛡️ ThreatTracker</div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/incidents"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Incidents
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
