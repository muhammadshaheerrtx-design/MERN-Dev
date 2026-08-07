import { useParams, useNavigate, Link } from "react-router-dom";
import { useIncidents } from "../context/IncidentContext";

export default function IncidentDetailPage() {
  const { id } = useParams(); // Extract URL parameter e.g., /incidents/INC-101
  const navigate = useNavigate();
  const { incidents } = useIncidents();

  const incident = incidents.find((item) => item.id === id);

  if (!incident) {
    return (
      <div className="page-container">
        <h2>⚠️ Incident Not Found</h2>
        <p>
          No threat record matching ID: <code>{id}</code>
        </p>
        <button
          onClick={() => navigate("/incidents")}
          className="btn-secondary"
        >
          ⬅️ Back to Incidents
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-back">
        ⬅️ Back
      </button>

      <div className="detail-box">
        <div className="detail-header">
          <h2>{incident.title}</h2>
          <span className={`badge badge-${incident.severity.toLowerCase()}`}>
            {incident.severity} Severity
          </span>
        </div>

        <p className="meta-info">
          <strong>ID:</strong> {incident.id} | <strong>Logged:</strong>{" "}
          {incident.timestamp} | <strong>Status:</strong> {incident.status}
        </p>

        <hr />

        <div className="detail-section">
          <h3>Forensic Description</h3>
          <p>{incident.description}</p>
        </div>

        <div className="detail-section">
          <h3>Remediation & Mitigation</h3>
          <p>{incident.mitigation}</p>
        </div>
      </div>
    </div>
  );
}
