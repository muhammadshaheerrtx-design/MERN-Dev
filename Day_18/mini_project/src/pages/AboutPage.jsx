export default function AboutPage() {
  return (
    <div className="page-container">
      <h1>About CISA Threat Intel</h1>
      <p className="subtitle">
        Understanding Binding Operational Directive BOD 22-01.
      </p>

      <div className="about-content">
        <section className="about-section">
          <h2>Overview</h2>
          <p>
            The Cyber Intel platform continuously synchronizes with the
            Cybersecurity and Infrastructure Security Agency's (CISA) Known
            Exploited Vulnerabilities (KEV) catalog. This catalog serves as the
            definitive authority on vulnerabilities that have been weaponized by
            threat actors in the wild.
          </p>
        </section>

        <section className="about-section">
          <h2>Federal Mandate BOD 22-01</h2>
          <p>
            Binding Operational Directive 22-01 requires US Federal Civilian
            Executive Branch agencies to remediate cataloged vulnerabilities
            within strict timelines to prevent unauthorized network intrusion,
            data exfiltration, and ransomware deployments.
          </p>
        </section>

        <section className="about-section">
          <h2>System Architecture</h2>
          <ul>
            <li>
              <strong>Frontend Core:</strong> React 18 SPA powered by Vite.
            </li>
            <li>
              <strong>Routing & State:</strong> React Router DOM v6 combined
              with React Context API.
            </li>
            <li>
              <strong>Data Source:</strong> CISA KEV JSON Feed (Updated
              continuously).
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
