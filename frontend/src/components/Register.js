import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '', // Assurez-vous que le champ s'appelle "password" ici
    role: 'admin', // Valeur par défaut ou sélectionnée
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/utilisateurs/register', formData)
      .then((res) => {
        console.log(res.data);
        navigate('/'); // Rediriger vers la page de connexion après inscription
      })
      .catch((err) => console.error('Erreur lors de l\'inscription:', err));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nom</Form.Label>
        <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Rôle</Form.Label>
        <Form.Select name="role" value={formData.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="secretaire">Secrétaire</option>
          <option value="pasteur">Pasteur</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        S'inscrire
      </Button>
    </Form>
  );
}

export default Register;