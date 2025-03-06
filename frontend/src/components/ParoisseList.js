import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function ParoisseList() {
  const [paroisses, setParoisses] = useState([]);
  const [synodes, setSynodes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    id_synode: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchParoisses = useCallback(() => {
    axios
      .get('http://localhost:5000/api/paroisses')
      .then((res) => setParoisses(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des paroisses:', err));
  }, []);

  const fetchSynodes = useCallback(() => {
    axios
      .get('http://localhost:5000/api/synodes')
      .then((res) => setSynodes(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des synodes:', err));
  }, []);

  useEffect(() => {
    fetchParoisses();
    fetchSynodes();
  }, [fetchParoisses, fetchSynodes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log('Données envoyées:', formData); // Log pour débogage
    axios
      .post('http://localhost:5000/api/paroisses', formData)
      .then((res) => {
        setShowAddModal(false);
        fetchParoisses();
        setFormData({ nom: '', adresse: '', id_synode: '' });
      })
      .catch((err) => {
        console.error('Erreur lors de l\'ajout:', err.response?.data || err.message);
      });
  };

  const handleEdit = (paroisse) => {
    setFormData({
      nom: paroisse.nom,
      adresse: paroisse.adresse,
      id_synode: paroisse.id_synode,
    });
    setEditId(paroisse.id_paroisse);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Données envoyées pour modification:', formData); // Log pour débogage
    axios
      .put(`http://localhost:5000/api/paroisses/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchParoisses();
        setFormData({ nom: '', adresse: '', id_synode: '' });
        setEditId(null);
      })
      .catch((err) => {
        console.error('Erreur lors de la modification:', err.response?.data || err.message);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette paroisse ?')) {
      axios
        .delete(`http://localhost:5000/api/paroisses/${id}`)
        .then(() => fetchParoisses())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Paroisses</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaPlus /> Ajouter une Paroisse
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Synode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paroisses.map((paroisse) => (
            <tr key={paroisse.id_paroisse}>
              <td>{paroisse.id_paroisse}</td>
              <td>{paroisse.nom}</td>
              <td>{paroisse.adresse}</td>
              <td>
                {synodes.find((s) => s.id_synode === paroisse.id_synode)?.nom || 'Inconnu'}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(paroisse)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(paroisse.id_paroisse)}>
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
          <Modal.Title>Ajouter une Paroisse</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>Synode</Form.Label>
              <Form.Select
                name="id_synode"
                value={formData.id_synode}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un synode</option>
                {synodes.map((synode) => (
                  <option key={synode.id_synode} value={synode.id_synode}>
                    {synode.nom}
                  </option>
                ))}
              </Form.Select>
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
          <Modal.Title>Modifier une Paroisse</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>Synode</Form.Label>
              <Form.Select
                name="id_synode"
                value={formData.id_synode}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un synode</option>
                {synodes.map((synode) => (
                  <option key={synode.id_synode} value={synode.id_synode}>
                    {synode.nom}
                  </option>
                ))}
              </Form.Select>
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

export default ParoisseList;