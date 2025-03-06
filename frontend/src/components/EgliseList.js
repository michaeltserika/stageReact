import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaChurch, FaEdit, FaTrash } from 'react-icons/fa';

function EgliseList() {
  const [eglises, setEglises] = useState([]);
  const [paroisses, setParoisses] = useState([]); // Liste des paroisses
  const [synodes, setSynodes] = useState([]); // Liste des synodes
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'catholique',
    id_paroisse: '',
    id_synode: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchEglises = useCallback(() => {
    axios
      .get('http://localhost:5000/api/eglises')
      .then((res) => setEglises(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des églises:', err));
  }, []);

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
    fetchEglises();
    fetchParoisses();
    fetchSynodes();
  }, [fetchEglises, fetchParoisses, fetchSynodes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/eglises', formData)
      .then(() => {
        setShowAddModal(false);
        fetchEglises();
        setFormData({ nom: '', type: 'catholique', id_paroisse: '', id_synode: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (eglise) => {
    setFormData({
      nom: eglise.nom,
      type: eglise.type,
      id_paroisse: eglise.id_paroisse,
      id_synode: eglise.id_synode,
    });
    setEditId(eglise.id_eglise);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/eglises/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchEglises();
        setFormData({ nom: '', type: 'catholique', id_paroisse: '', id_synode: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette église ?')) {
      axios
        .delete(`http://localhost:5000/api/eglises/${id}`)
        .then(() => fetchEglises())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Églises</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaChurch /> Ajouter une Église
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Paroisse</th>
            <th>Synode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {eglises.map((eglise) => (
            <tr key={eglise.id_eglise}>
              <td>{eglise.id_eglise}</td>
              <td>{eglise.nom}</td>
              <td>{eglise.type}</td>
              <td>
                {paroisses.find((p) => p.id_paroisse === eglise.id_paroisse)?.nom || 'Inconnue'}
              </td>
              <td>
                {synodes.find((s) => s.id_synode === eglise.id_synode)?.nom || 'Inconnu'}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(eglise)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(eglise.id_eglise)}>
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
          <Modal.Title>Ajouter une Église</Modal.Title>
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
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="catholique">Catholique</option>
                <option value="protestante">Protestante</option>
                <option value="évangélique">Évangélique</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Paroisse</Form.Label>
              <Form.Select
                name="id_paroisse"
                value={formData.id_paroisse}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une paroisse</option>
                {paroisses.map((paroisse) => (
                  <option key={paroisse.id_paroisse} value={paroisse.id_paroisse}>
                    {paroisse.nom}
                  </option>
                ))}
              </Form.Select>
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
          <Modal.Title>Modifier une Église</Modal.Title>
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
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="catholique">Catholique</option>
                <option value="protestante">Protestante</option>
                <option value="évangélique">Évangélique</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Paroisse</Form.Label>
              <Form.Select
                name="id_paroisse"
                value={formData.id_paroisse}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une paroisse</option>
                {paroisses.map((paroisse) => (
                  <option key={paroisse.id_paroisse} value={paroisse.id_paroisse}>
                    {paroisse.nom}
                  </option>
                ))}
              </Form.Select>
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

export default EgliseList;