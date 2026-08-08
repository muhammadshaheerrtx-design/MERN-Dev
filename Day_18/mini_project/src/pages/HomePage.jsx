import { Link } from "react-router-dom";
import { useVulnerabilities } from "../context/VulnerabilityContext";
import MetricCard from "../components/MetricCard";
import VulnerabilityCard from "../components/VulnerabilityCard";

export default function HomePage() {
  const {
    vulnerabilities,
    catalogInfo,
    loading,
    error,
    getRansomwareThreats,
    getTopVendors,
  } = useVulnerabilities();

  if (loading)
    return (
      <div className="page-container status-box">
        Loading security intelligence catalog...
      </div>
    );

  const ransomwareCount = getRansomwareThreats().length;
  const topVendors = getTopVendors();
  const recentCVEs = vulnerabilities.slice(0, 6);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>CISA Threat Intelligence Dashboard</h1>
        <p className="subtitle">
          Real-time tracking of actively exploited security vulnerabilities
          cataloged under Federal Directive BOD 22-01.
        </p>
      </div>

      {error && <div className="status-banner warning-banner">{error}</div>}

      <div className="metrics-grid">
        <MetricCard
          title="Total Active CVEs"
          value={vulnerabilities.length.toLocaleString()}
          subtitle={`Catalog v${catalogInfo.version}`}
          icon="📊"
        />
        <MetricCard
          title="Ransomware Linked"
          value={ransomwareCount.toLocaleString()}
          subtitle={`${((ransomwareCount / vulnerabilities.length) * 100).toFixed(1)}% of total vulnerabilities`}
          icon="🚨"
          variant="danger"
        />
        <MetricCard
          title="Primary Target Vendor"
          value={topVendors[0] ? topVendors[0][0] : "N/A"}
          subtitle={
            topVendors[0] ? `${topVendors[0][1]} cataloged exploits` : ""
          }
          icon="🎯"
          variant="warning"
        />
      </div>

      <div className="dashboard-grid">
        <div className="recent-threats-section">
          <div className="section-header">
            <h2>Recently Added Exploits</h2>
            <Link to="/vulnerabilities" className="view-all-link">
              View All Catalog Items ➔
            </Link>
          </div>
          <div className="card-grid">
            {recentCVEs.map((item) => (
              <VulnerabilityCard key={item.cveID} item={item} />
            ))}
          </div>
        </div>

        <aside className="vendor-summary-sidebar">
          <h3>Most Exploited Vendors</h3>
          <ul className="vendor-list">
            {topVendors.map(([vendor, count]) => (
              <li key={vendor} className="vendor-item">
                <span className="vendor-name">{vendor}</span>
                <span className="vendor-count-badge">{count} CVEs</span>
              </li>
            ))}
          </ul>
          <div className="ransomware-promo-box">
            <h4>⚠️ Ransomware Threat Focus</h4>
            <p>
              Over {ransomwareCount} CVEs in this feed are actively weaponized
              by ransomware syndicates.
            </p>
            <Link to="/ransomware" className="btn-primary btn-block">
              Inspect Ransomware List
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
