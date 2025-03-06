import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaUserPlus, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';

function ChretienList() {
  const [chretiens, setChretiens] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    adresse: '',
    contact: '',
    statut: 'actif',
  });
  const [editId, setEditId] = useState(null);

  const fetchChretiens = useCallback(() => {
    axios
      .get('http://localhost:5000/api/chretiens')
      .then((res) => setChretiens(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des chrétiens:', err));
  }, []);

  useEffect(() => {
    fetchChretiens();
  }, [fetchChretiens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/chretiens', formData)
      .then(() => {
        setShowAddModal(false);
        fetchChretiens();
        setFormData({ nom: '', prenom: '', date_naissance: '', adresse: '', contact: '', statut: 'actif' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (chretien) => {
    setFormData(chretien);
    setEditId(chretien.id_chretien);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/chretiens/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchChretiens();
        setFormData({ nom: '', prenom: '', date_naissance: '', adresse: '', contact: '', statut: 'actif' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce chrétien ?')) {
      axios
        .delete(`http://localhost:5000/api/chretiens/${id}`)
        .then(() => fetchChretiens())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  const handlePrintCard = (chretien) => {
    const cardContent = `
      <style>
        body { font-family: Arial, sans-serif; }
        .card { border: 1px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .footer { margin-top: 20px; text-align: center; }
      </style>
      <div class="card">
        <div class="header">
          <h3>ÉGLISE SAINT-PAUL</h3>
          <p>-----------------------------------------------------</p>
          <p>📷 [Photo du membre]</p>
        </div>
        <p><strong>NOM :</strong> ${chretien.nom}</p>
        <p><strong>PRÉNOM :</strong> ${chretien.prenom}</p>
        <p><strong>DATE DE NAISSANCE :</strong> ${chretien.date_naissance}</p>
        <p><strong>ADRESSE :</strong> ${chretien.adresse}</p>
        <p><strong>CONTACT :</strong> ${chretien.contact}</p>
        <p><strong>DATE D’ADHÉSION :</strong> [À ajouter via une nouvelle colonne si nécessaire]</p>
        <p><strong>RÔLE DANS L'ÉGLISE :</strong> [À récupérer via Chretien_Role]</p>
        <p>-----------------------------------------------------</p>
        <div class="footer">
          <p>ÉGLISE SAINT-PAUL<br>123 Rue de la Foi, Ville A<br>Téléphone : 0123 456 789 – Email : contact@eglise-saintpaul.com</p>
          <p>Signature du Pasteur : [Signature]<br>📜 Cachet de l’église</p>
        </div>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cardContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <h2>Liste des Chrétiens</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaUserPlus /> Ajouter un Chrétien
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Contact</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chretiens.map((chretien) => (
            <tr key={chretien.id_chretien}>
              <td>{chretien.id_chretien}</td>
              <td>{chretien.nom}</td>
              <td>{chretien.prenom}</td>
              <td>{chretien.contact}</td>
              <td>{chretien.statut}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(chretien)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(chretien.id_chretien)}>
                  <FaTrash />
                </Button>
                <Button variant="info" size="sm" onClick={() => handlePrintCard(chretien)}>
                  <FaPrint />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Chrétien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control as="textarea" name="adresse" value={formData.adresse} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="contact" value={formData.contact} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select name="statut" value={formData.statut} onChange={handleChange}>
                <option value="actif">Actif</option>
                <option value="décédé">Décédé</option>
                <option value="nouveau">Nouveau</option>
                <option value="affecté">Affecté</option>
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
          <Modal.Title>Modifier un Chrétien</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control as="textarea" name="adresse" value={formData.adresse} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="contact" value={formData.contact} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select name="statut" value={formData.statut} onChange={handleChange}>
                <option value="actif">Actif</option>
                <option value="décédé">Décédé</option>
                <option value="nouveau">Nouveau</option>
                <option value="affecté">Affecté</option>
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

export default ChretienList;