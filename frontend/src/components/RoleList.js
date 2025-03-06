import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    libelle: '', // Changé de "nom" à "libelle"
  });
  const [editId, setEditId] = useState(null);

  const fetchRoles = useCallback(() => {
    axios
      .get('http://localhost:5000/api/roles')
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des rôles:', err));
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/roles', formData)
      .then(() => {
        setShowAddModal(false);
        fetchRoles();
        setFormData({ libelle: '' }); // Mise à jour
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (role) => {
    setFormData({
      libelle: role.libelle, // Changé de "nom" à "libelle"
    });
    setEditId(role.id_role);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/roles/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchRoles();
        setFormData({ libelle: '' }); // Mise à jour
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      axios
        .delete(`http://localhost:5000/api/roles/${id}`)
        .then(() => fetchRoles())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  return (
    <div>
      <h2>Liste des Rôles</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaPlus /> Ajouter un Rôle
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Libellé</th> {/* Changé de "Nom" à "Libellé" */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id_role}>
              <td>{role.id_role}</td>
              <td>{role.libelle}</td> {/* Changé de "nom" à "libelle" */}
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(role)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(role.id_role)}>
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
          <Modal.Title>Ajouter un Rôle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Libellé</Form.Label> {/* Changé de "Nom" à "Libellé" */}
              <Form.Control
                type="text"
                name="libelle" // Changé de "nom" à "libelle"
                value={formData.libelle}
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
          <Modal.Title>Modifier un Rôle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Libellé</Form.Label> {/* Changé de "Nom" à "Libellé" */}
              <Form.Control
                type="text"
                name="libelle" // Changé de "nom" à "libelle"
                value={formData.libelle}
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

export default RoleList;