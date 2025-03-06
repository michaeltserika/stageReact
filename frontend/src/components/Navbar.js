import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';

function AppNavbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href={isAuthenticated ? '/dashboard' : '/'}>
          Église Saint-Paul
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link href="/dashboard">Tableau de bord</Nav.Link>
                <Nav.Link href="/chretiens">Chrétiens</Nav.Link>
                <Nav.Link href="/evenements">Événements</Nav.Link>
                <Nav.Link href="/finances">Finances</Nav.Link>
                <Nav.Link href="/eglises">Églises</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="#accueil">Accueil</Nav.Link>
                <Nav.Link href="#apropos">À propos</Nav.Link>
                <Nav.Link href="#contact">Contact</Nav.Link>
              </>
            )}
          </Nav>
          <Button
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
            className="me-2"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </Button>
          {isAuthenticated ? (
            <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} onClick={handleLogout}>
              <FaSignOutAlt /> Déconnexion
            </Button>
          ) : (
            <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} onClick={() => navigate('/')}>
              Connexion/Inscription
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;