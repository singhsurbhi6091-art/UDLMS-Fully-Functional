import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import BusinessDashboard from "./pages/BusinessDashboard"
import LMODashboard from "./pages/LMODashboard"
import DigitalCertificateView from "./pages/DigitalCertificateView"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Routes>
          {/* Primary Root Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/business/*" element={<BusinessDashboard />} />
          <Route path="/lmo/*" element={<LMODashboard />} />
          <Route path="/certificate/:id" element={<DigitalCertificateView />} />

          {/* Subpath compatibility */}
          <Route path="/UDLMS" element={<Navigate to="/" replace />} />
          <Route path="/UDLMS/business/*" element={<Navigate to="/business" replace />} />
          <Route path="/UDLMS/lmo/*" element={<Navigate to="/lmo" replace />} />
          <Route path="/UDLMS/certificate/:id" element={<DigitalCertificateView />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
