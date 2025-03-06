import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaCalendarPlus, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';

function EvenementList() {
  const [evenements, setEvenements] = useState([]);
  const [chretiens, setChretiens] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    type_evenement: 'baptême',
    date_evenement: '',
    description: '',
    id_chretien: '',
    id_chretien_conjoint: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchEvenements = useCallback(() => {
    axios
      .get('http://localhost:5000/api/evenements')
      .then((res) => setEvenements(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des événements:', err));
  }, []);

  const fetchChretiens = useCallback(() => {
    axios
      .get('http://localhost:5000/api/chretiens')
      .then((res) => setChretiens(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des chrétiens:', err));
  }, []);

  useEffect(() => {
    fetchEvenements();
    fetchChretiens();
  }, [fetchEvenements, fetchChretiens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/evenements', formData)
      .then(() => {
        setShowAddModal(false);
        fetchEvenements();
        setFormData({ type_evenement: 'baptême', date_evenement: '', description: '', id_chretien: '', id_chretien_conjoint: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (evenement) => {
    setFormData({
      type_evenement: evenement.type_evenement,
      date_evenement: evenement.date_evenement,
      description: evenement.description,
      id_chretien: evenement.id_chretien,
      id_chretien_conjoint: evenement.id_chretien_conjoint || '',
    });
    setEditId(evenement.id_evenement);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/evenements/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchEvenements();
        setFormData({ type_evenement: 'baptême', date_evenement: '', description: '', id_chretien: '', id_chretien_conjoint: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      axios
        .delete(`http://localhost:5000/api/evenements/${id}`)
        .then(() => fetchEvenements())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  const handlePrintMarriageCard = (evenement) => {
    if (evenement.type_evenement !== 'mariage') return;
    const chretien = chretiens.find((c) => c.id_chretien === evenement.id_chretien);
    const conjoint = chretiens.find((c) => c.id_chretien === evenement.id_chretien_conjoint);
    const cardContent = `
      <style>
        body { font-family: Arial, sans-serif; }
        .card { width: 400px; height: 250px; margin: 20px auto; position: relative; }
        .recto, .verso { width: 100%; height: 100%; border: 1px solid #000; padding: 20px; box-sizing: border-box; }
        .recto { background: #f9f9f9; }
        .verso { background: #e9ecef; position: absolute; top: 0; transform: rotateY(180deg); }
        .header { text-align: center; }
        .footer { position: absolute; bottom: 10px; width: 90%; text-align: center; }
      </style>
      <div class="card">
        <div class="recto">
          <div class="header">
            <h3>ÉGLISE SAINT-PAUL</h3>
            <p>-----------------------------------------------------</p>
            <p>👩‍❤️‍👨 CARTE DE MARIAGE</p>
          </div>
          <p><strong>ÉPOUX :</strong> ${chretien?.nom || 'Inconnu'} ${chretien?.prenom || 'Inconnu'}</p>
          <p><strong>ÉPOUSE :</strong> ${conjoint?.nom || 'Inconnu'} ${conjoint?.prenom || 'Inconnu'}</p>
          <p><strong>DATE DU MARIAGE :</strong> ${evenement.date_evenement}</p>
          <p><strong>LIEU :</strong> Église Saint-Paul</p>
        </div>
        <div class="verso">
          <div class="header">
            <h3>ÉGLISE SAINT-PAUL</h3>
          </div>
          <p>Adresse : 123 Rue de la Foi, Ville A</p>
          <p>Contact : 0123 456 789 / contact@eglise-saintpaul.com</p>
          <div class="footer">
            <p>Signature du Pasteur : [Signature]<br>📜 Cachet de l’église</p>
          </div>
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
      <h2>Liste des Événements</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaCalendarPlus /> Ajouter un Événement
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Chrétien</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evenements.map((evenement) => (
            <tr key={evenement.id_evenement}>
              <td>{evenement.id_evenement}</td>
              <td>{evenement.type_evenement}</td>
              <td>{evenement.date_evenement}</td>
              <td>{evenement.description}</td>
              <td>
                {chretiens.find((c) => c.id_chretien === evenement.id_chretien)?.nom || 'Inconnu'}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(evenement)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(evenement.id_evenement)}>
                  <FaTrash />
                </Button>
                {evenement.type_evenement === 'mariage' && (
                  <Button variant="info" size="sm" onClick={() => handlePrintMarriageCard(evenement)}>
                    <FaPrint /> Carte
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'événement</Form.Label>
              <Form.Select name="type_evenement" value={formData.type_evenement} onChange={handleChange}>
                <option value="baptême">Baptême</option>
                <option value="mariage">Mariage</option>
                <option value="décès">Décès</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date_evenement"
                value={formData.date_evenement}
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
              <Form.Label>Chrétien</Form.Label>
              <Form.Select
                name="id_chretien"
                value={formData.id_chretien}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un chrétien</option>
                {chretiens.map((chretien) => (
                  <option key={chretien.id_chretien} value={chretien.id_chretien}>
                    ${chretien.nom} ${chretien.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {formData.type_evenement === 'mariage' && (
              <Form.Group className="mb-3">
                <Form.Label>Conjoint</Form.Label>
                <Form.Select
                  name="id_chretien_conjoint"
                  value={formData.id_chretien_conjoint}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un conjoint</option>
                  {chretiens.map((chretien) => (
                    <option key={chretien.id_chretien} value={chretien.id_chretien}>
                      ${chretien.nom} ${chretien.prenom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Modification */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier un Événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'événement</Form.Label>
              <Form.Select name="type_evenement" value={formData.type_evenement} onChange={handleChange}>
                <option value="baptême">Baptême</option>
                <option value="mariage">Mariage</option>
                <option value="décès">Décès</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date_evenement"
                value={formData.date_evenement}
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
              <Form.Label>Chrétien</Form.Label>
              <Form.Select
                name="id_chretien"
                value={formData.id_chretien}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un chrétien</option>
                {chretiens.map((chretien) => (
                  <option key={chretien.id_chretien} value={chretien.id_chretien}>
                    ${chretien.nom} ${chretien.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {formData.type_evenement === 'mariage' && (
              <Form.Group className="mb-3">
                <Form.Label>Conjoint</Form.Label>
                <Form.Select
                  name="id_chretien_conjoint"
                  value={formData.id_chretien_conjoint}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un conjoint</option>
                  {chretiens.map((chretien) => (
                    <option key={chretien.id_chretien} value={chretien.id_chretien}>
                      ${chretien.nom} ${chretien.prenom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EvenementList;