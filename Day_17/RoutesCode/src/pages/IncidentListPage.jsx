import { Link } from "react-router-dom";
import { useIncidents } from "../context/IncidentContext";

export default function IncidentListPage() {
  const { incidents } = useIncidents();

  return (
    <div className="page-container">
      <h1>Security Incident Logs</h1>
      <p className="subtitle">
        Click on any incident ID to review deep forensics and mitigation
        details.
      </p>

      <div className="incident-grid">
        {incidents.map((incident) => (
          <div key={incident.id} className="incident-card">
            <div className="card-header">
              <span className="incident-id">{incident.id}</span>
              <span
                className={`badge badge-${incident.severity.toLowerCase()}`}
              >
                {incident.severity}
              </span>
            </div>
            <h3>{incident.title}</h3>
            <p className="timestamp">{incident.timestamp}</p>
            <div className="card-footer">
              <span className="status-tag">Status: {incident.status}</span>
              <Link to={`/incidents/${incident.id}`} className="view-link">
                View Details ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
