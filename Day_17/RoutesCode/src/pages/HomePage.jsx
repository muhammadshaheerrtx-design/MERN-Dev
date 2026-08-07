import { Link } from "react-router-dom";
import { useIncidents } from "../context/IncidentContext";

export default function HomePage() {
  const { incidents } = useIncidents();

  const highSeverityCount = incidents.filter(
    (i) => i.severity === "High",
  ).length;
  const openCount = incidents.filter((i) => i.status !== "Resolved").length;

  return (
    <div className="page-container">
      <h1>Dashboard Overview</h1>
      <p className="subtitle">
        Real-time threat metrics and system security status.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Logged Incidents</h3>
          <p className="stat-number">{incidents.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active/Open Threats</h3>
          <p className="stat-number text-warning">{openCount}</p>
        </div>
        <div className="stat-card">
          <h3>High Severity Alerts</h3>
          <p className="stat-number text-danger">{highSeverityCount}</p>
        </div>
      </div>

      <div className="quick-action">
        <Link to="/incidents" className="btn-primary">
          View All Threat Logs ➔
        </Link>
      </div>
    </div>
  );
}
