import { createContext, useContext, useState } from "react";

const IncidentContext = createContext(null);

const INITIAL_INCIDENTS = [
  {
    id: "INC-101",
    title: "Unauthorized SSH Brute-Force Attempt",
    severity: "High",
    status: "Investigating",
    timestamp: "2026-08-07 14:22:00",
    description:
      "Multiple failed SSH login attempts detected from IP 192.168.1.105 targeting root access on Gateway-Server-01.",
    mitigation:
      "IP address placed in firewall blocklist. SSH password authentication disabled in favor of key-based auth.",
  },
  {
    id: "INC-102",
    title: "Phishing Email Campaign Detected",
    severity: "Medium",
    status: "Resolved",
    timestamp: "2026-08-06 09:15:00",
    description:
      "Suspicious email with spoofed domain containing executable attachment delivered to marketing department.",
    mitigation:
      "Malicious domain blacklisted at email gateway. Attachment hash added to endpoint defense rules.",
  },
  {
    id: "INC-103",
    title: "Kernel Memory Leak Anomalies",
    severity: "Low",
    status: "Open",
    timestamp: "2026-08-05 18:40:00",
    description:
      "Memory forensics highlighted irregular allocation patterns within kernel space during stress testing.",
    mitigation: "Flagged for deep heap memory analysis and trace tracking.",
  },
];

export function IncidentProvider({ children }) {
  const [incidents] = useState(INITIAL_INCIDENTS);

  return (
    <IncidentContext.Provider value={{ incidents }}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncidents must be used within an IncidentProvider");
  }
  return context;
}
