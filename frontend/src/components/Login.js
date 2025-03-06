import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', mot_de_passe: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/utilisateurs/login', formData)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/chretiens');
      })
      .catch(err => console.error(err));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Mot de passe</Form.Label><Form.Control type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} required /></Form.Group>
      <Button variant="primary" type="submit">Connexion</Button>
    </Form>
  );
}

export default Login;