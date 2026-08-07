import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IncidentProvider } from "./context/IncidentContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import IncidentListPage from "./pages/IncidentListPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  return (
    <IncidentProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/incidents" element={<IncidentListPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </IncidentProvider>
  );
}
