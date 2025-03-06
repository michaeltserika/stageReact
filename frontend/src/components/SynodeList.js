import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function SynodeList() {
  const [synodes, setSynodes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchSynodes = useCallback(() => {
    axios
      .get('http://localhost:5000/api/synodes')
      .then((res) => setSynodes(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des synodes:', err));
  }, []);

  useEffect(() => {
    fetchSynodes();
  }, [fetchSynodes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/synodes', formData)
      .then(() => {
        setShowAddModal(false);
        fetchSynodes();
        setFormData({ nom: '', adresse: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (synode) => {
    setFormData({
      nom: synode.nom,
      adresse: synode.adresse,
    });
    setEditId(synode.id_synode);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/synodes/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchSynodes();
        setFormData({ nom: '', adresse: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce synode ?')) {
      axios
        .delete(`http://localhost:5000/api/synodes/${id}`)
        .then(() => fetchSynodes())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Synodes</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaPlus /> Ajouter un Synode
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {synodes.map((synode) => (
            <tr key={synode.id_synode}>
              <td>{synode.id_synode}</td>
              <td>{synode.nom}</td>
              <td>{synode.adresse}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(synode)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(synode.id_synode)}>
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
          <Modal.Title>Ajouter un Synode</Modal.Title>
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
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                as="textarea"
                name="adresse"
                value={formData.adresse}
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
          <Modal.Title>Modifier un Synode</Modal.Title>
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
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                as="textarea"
                name="adresse"
                value={formData.adresse}
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

export default SynodeList;