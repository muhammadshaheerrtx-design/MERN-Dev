import { useVulnerabilities } from "../context/VulnerabilityContext";
import VulnerabilityCard from "../components/VulnerabilityCard";

export default function RansomwareWatchPage() {
  const { getRansomwareThreats, loading } = useVulnerabilities();

  if (loading)
    return (
      <div className="page-container status-box">
        Loading ransomware telemetry...
      </div>
    );

  const ransomwareThreats = getRansomwareThreats();

  return (
    <div className="page-container">
      <div className="banner-ransomware">
        <h1>🚨 Ransomware Threat Watchlist</h1>
        <p>
          Dedicated filter displaying vulnerabilities explicitly linked to
          active ransomware campaigns and extortion groups.
        </p>
      </div>

      <div className="stats-strip">
        <span>
          Total Ransomware Exploits Identified:{" "}
          <strong>{ransomwareThreats.length}</strong>
        </span>
      </div>

      <div className="card-grid">
        {ransomwareThreats.map((item) => (
          <VulnerabilityCard key={item.cveID} item={item} />
        ))}
      </div>
    </div>
  );
}
