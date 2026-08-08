import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VulnerabilityProvider } from "./context/VulnerabilityContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import VulnerabilityListPage from "./pages/VulnerabilityListPage";
import VulnerabilityDetailPage from "./pages/VulnerabilityDetailPage";
import RansomwareWatchPage from "./pages/RansomwareWatchPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  return (
    <VulnerabilityProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/vulnerabilities"
                element={<VulnerabilityListPage />}
              />
              <Route
                path="/vulnerability/:cveId"
                element={<VulnerabilityDetailPage />}
              />
              <Route path="/ransomware" element={<RansomwareWatchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </VulnerabilityProvider>
  );
}
