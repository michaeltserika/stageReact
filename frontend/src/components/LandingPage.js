import { useState } from 'react';
import { Container, Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaChurch, FaHandsHelping, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', mot_de_passe: '' });
  const [registerData, setRegisterData] = useState({ nom: '', email: '', mot_de_passe: '', role: 'admin' });
  const navigate = useNavigate();
  const theme = localStorage.getItem('theme') || 'light'; // Récupère le thème

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/utilisateurs/login', loginData);
      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        setShowLogin(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      alert('Échec de la connexion');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/utilisateurs/register', registerData);
      if (response.data.success) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setShowRegister(false);
        setRegisterData({ nom: '', email: '', mot_de_passe: '', role: 'admin' });
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      alert("Échec de l'inscription");
    }
  };

  return (
    <div className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} style={{ minHeight: '100vh' }}>
      <Container className="mt-5">
        {/* Section Accueil */}
        <section id="accueil" className="text-center py-5">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Bienvenue à l’Église Saint-Paul
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Un lieu de foi, d’amour et de communauté.
          </motion.p>
          <Button variant={theme === 'dark' ? 'outline-light' : 'primary'} className="me-2" onClick={() => setShowLogin(true)}>
            <FaSignInAlt /> Connexion
          </Button>
          <Button variant={theme === 'dark' ? 'outline-light' : 'primary'} onClick={() => setShowRegister(true)}>
            <FaUserPlus /> Inscription
          </Button>
        </section>

        {/* Section Nos Activités */}
        <section id="activites" className="mt-5">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Nos Activités
          </motion.h2>
          <Row className="mt-4">
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'} className="shadow-sm">
                  <Card.Body>
                    <Card.Title><FaChurch /> Célébrations</Card.Title>
                    <Card.Text>
                      Rejoignez-nous chaque dimanche à 10h pour nos cultes vibrants et inspirants.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'} className="shadow-sm">
                  <Card.Body>
                    <Card.Title><FaHandsHelping /> Service Communautaire</Card.Title>
                    <Card.Text>
                      Participez à nos initiatives pour aider les plus démunis dans notre quartier.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'} className="shadow-sm">
                  <Card.Body>
                    <Card.Title><FaBook /> Études Bibliques</Card.Title>
                    <Card.Text>
                      Approfondissez votre foi avec nos groupes d’étude chaque mercredi soir.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </section>

        {/* Section À propos */}
        <section id="apropos" className="mt-5">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            À propos de nous
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Fondée il y a plus de 50 ans, l’Église Saint-Paul est un pilier de la communauté, offrant un espace de prière, de soutien et de connexion spirituelle. Notre mission est de partager l’amour de Dieu à travers des actions concrètes et une foi vivante.
          </motion.p>
        </section>

        {/* Section Témoignages */}
        <section id="temoignages" className="mt-5">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Témoignages
          </motion.h2>
          <Row className="mt-4">
            <Col md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'} className="shadow-sm">
                  <Card.Body>
                    <Card.Text>
                      "L’Église Saint-Paul m’a accueilli comme une famille. Les cultes sont une source d’inspiration chaque semaine."
                    </Card.Text>
                    <Card.Footer>- Marie D.</Card.Footer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'} className="shadow-sm">
                  <Card.Body>
                    <Card.Text>
                      "Les études bibliques m’ont aidé à grandir spirituellement. Une communauté incroyable !"
                    </Card.Text>
                    <Card.Footer>- Jean P.</Card.Footer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </section>

        {/* Section Contact */}
        <section id="contact" className="mt-5">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contactez-nous
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p><strong>Adresse :</strong> 123 Rue de la Foi, Ville A</p>
            <p><strong>Email :</strong> contact@eglise-saintpaul.com</p>
            <p><strong>Téléphone :</strong> 0123 456 789</p>
          </motion.div>
        </section>
      </Container>

      {/* Modal Connexion */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connexion Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                placeholder="Entrez votre email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="mot_de_passe"
                value={loginData.mot_de_passe}
                onChange={handleLoginChange}
                required
                placeholder="Entrez votre mot de passe"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Se connecter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Inscription */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Inscription Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={registerData.nom}
                onChange={handleRegisterChange}
                required
                placeholder="Entrez votre nom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                placeholder="Entrez votre email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="mot_de_passe"
                value={registerData.mot_de_passe}
                onChange={handleRegisterChange}
                required
                placeholder="Entrez votre mot de passe"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select name="role" value={registerData.role} onChange={handleRegisterChange}>
                <option value="admin">Admin</option>
                <option value="utilisateur">Utilisateur</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              S'inscrire
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <footer className={`text-center py-3 mt-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <p>© 2025 Église Saint-Paul. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default LandingPage;