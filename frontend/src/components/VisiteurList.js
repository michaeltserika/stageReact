import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function VisiteurList() {
  const [visiteurs, setVisiteurs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: '',
    date_visite: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchVisiteurs = useCallback(() => {
    axios
      .get('http://localhost:5000/api/visiteurs')
      .then((res) => setVisiteurs(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des visiteurs:', err));
  }, []);

  useEffect(() => {
    fetchVisiteurs();
  }, [fetchVisiteurs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/visiteurs', formData)
      .then(() => {
        setShowAddModal(false);
        fetchVisiteurs();
        setFormData({ nom: '', email: '', message: '', date_visite: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (visiteur) => {
    setFormData({
      nom: visiteur.nom,
      email: visiteur.email,
      message: visiteur.message,
      date_visite: visiteur.date_visite.split('T')[0], // Format pour input date
    });
    setEditId(visiteur.id_visiteur);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/visiteurs/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchVisiteurs();
        setFormData({ nom: '', email: '', message: '', date_visite: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce visiteur ?')) {
      axios
        .delete(`http://localhost:5000/api/visiteurs/${id}`)
        .then(() => fetchVisiteurs())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Visiteurs</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaPlus /> Ajouter un Visiteur
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date de visite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visiteurs.map((visiteur) => (
            <tr key={visiteur.id_visiteur}>
              <td>{visiteur.id_visiteur}</td>
              <td>{visiteur.nom}</td>
              <td>{visiteur.email}</td>
              <td>{visiteur.message}</td>
              <td>{visiteur.date_visite}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(visiteur)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(visiteur.id_visiteur)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Visiteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de visite</Form.Label>
              <Form.Control
                type="date"
                name="date_visite"
                value={formData.date_visite}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Modification */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier un Visiteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de visite</Form.Label>
              <Form.Control
                type="date"
                name="date_visite"
                value={formData.date_visite}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default VisiteurList;