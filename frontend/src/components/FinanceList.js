import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaMoneyBillWave, FaEdit, FaTrash } from 'react-icons/fa';

function FinanceList() {
  const [finances, setFinances] = useState([]);
  const [eglises, setEglises] = useState([]); // Liste des églises pour le select
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    montant: '',
    type: 'donation',
    date: '',
    description: '',
    id_eglise: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchFinances = useCallback(() => {
    axios
      .get('http://localhost:5000/api/finances')
      .then((res) => setFinances(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des finances:', err));
  }, []);

  const fetchEglises = useCallback(() => {
    axios
      .get('http://localhost:5000/api/eglises')
      .then((res) => setEglises(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des églises:', err));
  }, []);

  useEffect(() => {
    fetchFinances();
    fetchEglises(); // Charger les églises au montage
  }, [fetchFinances, fetchEglises]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/finances', formData)
      .then(() => {
        setShowAddModal(false);
        fetchFinances();
        setFormData({ montant: '', type: 'donation', date: '', description: '', id_eglise: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (finance) => {
    setFormData({
      montant: finance.montant,
      type: finance.type,
      date: finance.date,
      description: finance.description,
      id_eglise: finance.id_eglise,
    });
    setEditId(finance.id_finance);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/finances/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchFinances();
        setFormData({ montant: '', type: 'donation', date: '', description: '', id_eglise: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette finance ?')) {
      axios
        .delete(`http://localhost:5000/api/finances/${id}`)
        .then(() => fetchFinances())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Finances</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaMoneyBillWave /> Ajouter une Finance
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Montant</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Église</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((finance) => (
            <tr key={finance.id_finance}>
              <td>{finance.id_finance}</td>
              <td>{finance.montant}</td>
              <td>{finance.type}</td>
              <td>{finance.date}</td>
              <td>{finance.description}</td>
              <td>
                {eglises.find((e) => e.id_eglise === finance.id_eglise)?.nom || 'Inconnue'}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(finance)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(finance.id_finance)}>
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
          <Modal.Title>Ajouter une Finance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Montant</Form.Label>
              <Form.Control
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="donation">Donation</option>
                <option value="collecte">Collecte</option>
                <option value="dépense">Dépense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Église</Form.Label>
              <Form.Select
                name="id_eglise"
                value={formData.id_eglise}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une église</option>
                {eglises.map((eglise) => (
                  <option key={eglise.id_eglise} value={eglise.id_eglise}>
                    {eglise.nom}
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
          <Modal.Title>Modifier une Finance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Montant</Form.Label>
              <Form.Control
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="donation">Donation</option>
                <option value="collecte">Collecte</option>
                <option value="dépense">Dépense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Église</Form.Label>
              <Form.Select
                name="id_eglise"
                value={formData.id_eglise}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une église</option>
                {eglises.map((eglise) => (
                  <option key={eglise.id_eglise} value={eglise.id_eglise}>
                    {eglise.nom}
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

export default FinanceList;