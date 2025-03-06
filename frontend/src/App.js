import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChretienList from './components/ChretienList'; // À importer si existant
import EvenementList from './components/EvenementList'; // À importer si existant
import FinanceList from './components/FinanceList'; // À créer ou importer
import EgliseList from './components/EgliseList'; // À créer ou importer

function App() {
  const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';
  const theme = localStorage.getItem('theme') || 'light'; // Récupère le thème initial

  return (
    <Router>
      <div className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} style={{ minHeight: '100vh' }}>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/chretiens"
            element={isAuthenticated() ? <ChretienList /> : <Navigate to="/" />}
          />
          <Route
            path="/evenements"
            element={isAuthenticated() ? <EvenementList /> : <Navigate to="/" />}
          />
          <Route
            path="/finances"
            element={isAuthenticated() ? <FinanceList /> : <Navigate to="/" />}
          />
          <Route
            path="/eglises"
            element={isAuthenticated() ? <EgliseList /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;