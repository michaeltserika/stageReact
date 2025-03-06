import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';

function AttestationList() {
  const [attestations, setAttestations] = useState([]);
  const [chretiens, setChretiens] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    type_attestation: 'baptême',
    date_delivrance: '',
    id_chretien: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchAttestations = useCallback(() => {
    axios
      .get('http://localhost:5000/api/attestations')
      .then((res) => setAttestations(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des attestations:', err));
  }, []);

  const fetchChretiens = useCallback(() => {
    axios
      .get('http://localhost:5000/api/chretiens')
      .then((res) => setChretiens(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des chrétiens:', err));
  }, []);

  useEffect(() => {
    fetchAttestations();
    fetchChretiens();
  }, [fetchAttestations, fetchChretiens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/attestations', formData)
      .then(() => {
        setShowAddModal(false);
        fetchAttestations();
        setFormData({ type_attestation: 'baptême', date_delivrance: '', id_chretien: '' });
      })
      .catch((err) => console.error('Erreur lors de l\'ajout:', err));
  };

  const handleEdit = (attestation) => {
    setFormData({
      type_attestation: attestation.type_attestation,
      date_delivrance: attestation.date_delivrance,
      id_chretien: attestation.id_chretien,
    });
    setEditId(attestation.id_attestation);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/attestations/${editId}`, formData)
      .then(() => {
        setShowEditModal(false);
        fetchAttestations();
        setFormData({ type_attestation: 'baptême', date_delivrance: '', id_chretien: '' });
        setEditId(null);
      })
      .catch((err) => console.error('Erreur lors de la modification:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette attestation ?')) {
      axios
        .delete(`http://localhost:5000/api/attestations/${id}`)
        .then(() => fetchAttestations())
        .catch((err) => console.error('Erreur lors de la suppression:', err));
    }
  };

  const handlePrintAttestation = (attestation) => {
    const chretien = chretiens.find((c) => c.id_chretien === attestation.id_chretien);
    const attestationContent = `
      <style>
        body { font-family: Arial, sans-serif; }
        .attestation { border: 1px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .signature { margin-top: 50px; text-align: right; }
      </style>
      <div class="attestation">
        <div class="header">
          <h2>📜 Attestation d'Église</h2>
          <p>Église Saint-Paul<br>123 Rue de la Foi, Ville A<br>Téléphone : 0123 456 789 – Email : contact@eglise-saintpaul.com<br>Date : ${attestation.date_delivrance}</p>
        </div>
        <h3>ATTESTATION DE ${attestation.type_attestation.toUpperCase()}</h3>
        <p>Nous, soussignés, Pasteur Jean Dupont, certifions que :</p>
        <p>
          Nom : ${chretien?.nom || 'Inconnu'}<br>
          Prénom : ${chretien?.prenom || 'Inconnu'}<br>
          Date de naissance : ${chretien?.date_naissance || 'Non spécifiée'}<br>
          Lieu de naissance : Non spécifié
        </p>
        <p>
          A reçu le ${attestation.type_attestation}<br>
          Le ${attestation.date_delivrance} à l’Église Saint-Paul.
        </p>
        <p>En foi de quoi, cette attestation lui est délivrée.</p>
        <p>Fait à Ville A, le ${attestation.date_delivrance}</p>
        <div class="signature">
          📜 Pasteur Jean Dupont<br>
          [Signature & Cachet]
        </div>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(attestationContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintCard = async (attestation) => {
    const chretien = chretiens.find((c) => c.id_chretien === attestation.id_chretien);
    let cardContent = '';
    const type = attestation.type_attestation;

    if (type === 'baptême') {
      cardContent = `
        <style>
          body { font-family: Arial, sans-serif; }
          .card { width: 400px; height: 250px; margin: 20px auto; position: relative; }
          .recto, .verso { width: 100%; height: 100%; border: 1px solid #000; padding: 20px; box-sizing: border-box; }
          .recto { background: #f9f9f9; }
          .verso { background: #e9ecef; position: absolute; top: 0; }
          .header { text-align: center; }
          .footer { position: absolute; bottom: 10px; width: 90%; text-align: center; }
        </style>
        <div class="card">
          <div class="recto">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
              <p>-----------------------------------------------------</p>
              <p>📷 [Photo du baptisé]</p>
            </div>
            <p><strong>NOM :</strong> ${chretien?.nom || 'Inconnu'}</p>
            <p><strong>PRÉNOM :</strong> ${chretien?.prenom || 'Inconnu'}</p>
            <p><strong>DATE DE NAISSANCE :</strong> ${chretien?.date_naissance || 'Non spécifiée'}</p>
            <p><strong>DATE DU BAPTÊME :</strong> ${attestation.date_delivrance}</p>
            <p><strong>LIEU :</strong> Église Saint-Paul</p>
          </div>
          <div class="verso">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
            </div>
            <p>Adresse : 123 Rue de la Foi, Ville A</p>
            <p>Contact : 0123 456 789 / contact@eglise-saintpaul.com</p>
            <div class="footer">
              <p>Signature : [Signature]<br>📜 Cachet</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'confirmation') {
      cardContent = `
        <style>
          body { font-family: Arial, sans-serif; }
          .card { width: 400px; height: 250px; margin: 20px auto; position: relative; }
          .recto, .verso { width: 100%; height: 100%; border: 1px solid #000; padding: 20px; box-sizing: border-box; }
          .recto { background: #f9f9f9; }
          .verso { background: #e9ecef; position: absolute; top: 0; }
          .header { text-align: center; }
          .footer { position: absolute; bottom: 10px; width: 90%; text-align: center; }
        </style>
        <div class="card">
          <div class="recto">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
              <p>-----------------------------------------------------</p>
              <p>📜 CARTE DE CONFIRMATION</p>
            </div>
            <p><strong>NOM :</strong> ${chretien?.nom || 'Inconnu'}</p>
            <p><strong>PRÉNOM :</strong> ${chretien?.prenom || 'Inconnu'}</p>
            <p><strong>DATE DE CONFIRMATION :</strong> ${attestation.date_delivrance}</p>
            <p><strong>LIEU :</strong> Église Saint-Paul</p>
          </div>
          <div class="verso">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
            </div>
            <p>Adresse : 123 Rue de la Foi, Ville A</p>
            <p>Contact : 0123 456 789 / contact@eglise-saintpaul.com</p>
            <div class="footer">
              <p>Signature : [Signature]<br>📜 Cachet</p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'mariage') {
      const evenementResponse = await axios.get('http://localhost:5000/api/evenements');
      const evenement = evenementResponse.data.find((e) => e.id_chretien === chretien.id_chretien && e.type_evenement === 'mariage');
      const conjoint = chretiens.find((c) => c.id_chretien === evenement?.id_chretien_conjoint);
      cardContent = `
        <style>
          body { font-family: Arial, sans-serif; }
          .card { width: 400px; height: 250px; margin: 20px auto; position: relative; }
          .recto, .verso { width: 100%; height: 100%; border: 1px solid #000; padding: 20px; box-sizing: border-box; }
          .recto { background: #f9f9f9; }
          .verso { background: #e9ecef; position: absolute; top: 0; }
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
            <p><strong>DATE DU MARIAGE :</strong> ${attestation.date_delivrance}</p>
            <p><strong>LIEU :</strong> Église Saint-Paul</p>
          </div>
          <div class="verso">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
            </div>
            <p>Adresse : 123 Rue de la Foi, Ville A</p>
            <p>Contact : 0123 456 789 / contact@eglise-saintpaul.com</p>
            <div class="footer">
              <p>Signature : [Signature]<br>📜 Cachet</p>
            </div>
          </div>
        </div>
      `;
    } else {
      cardContent = `
        <style>
          body { font-family: Arial, sans-serif; }
          .card { width: 400px; height: 250px; margin: 20px auto; position: relative; }
          .recto, .verso { width: 100%; height: 100%; border: 1px solid #000; padding: 20px; box-sizing: border-box; }
          .recto { background: #f9f9f9; }
          .verso { background: #e9ecef; position: absolute; top: 0; }
          .header { text-align: center; }
          .footer { position: absolute; bottom: 10px; width: 90%; text-align: center; }
        </style>
        <div class="card">
          <div class="recto">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
              <p>-----------------------------------------------------</p>
              <p>📜 CARTE (${type.toUpperCase()})</p>
            </div>
            <p><strong>NOM :</strong> ${chretien?.nom || 'Inconnu'}</p>
            <p><strong>PRÉNOM :</strong> ${chretien?.prenom || 'Inconnu'}</p>
            <p><strong>DATE :</strong> ${attestation.date_delivrance}</p>
            <p><strong>LIEU :</strong> Église Saint-Paul</p>
          </div>
          <div class="verso">
            <div class="header">
              <h3>ÉGLISE SAINT-PAUL</h3>
            </div>
            <p>Adresse : 123 Rue de la Foi, Ville A</p>
            <p>Contact : 0123 456 789 / contact@eglise-saintpaul.com</p>
            <div class="footer">
              <p>Signature : [Signature]<br>📜 Cachet</p>
            </div>
          </div>
        </div>
      `;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cardContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <h2>Liste des Attestations</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        <FaPlus /> Ajouter une Attestation
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date de délivrance</th>
            <th>Chrétien</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attestations.map((attestation) => (
            <tr key={attestation.id_attestation}>
              <td>{attestation.id_attestation}</td>
              <td>{attestation.type_attestation}</td>
              <td>{attestation.date_delivrance}</td>
              <td>
                {chretiens.find((c) => c.id_chretien === attestation.id_chretien)?.nom || 'Inconnu'}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(attestation)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(attestation.id_attestation)}>
                  <FaTrash />
                </Button>
                <Button variant="info" size="sm" className="me-2" onClick={() => handlePrintAttestation(attestation)}>
                  <FaPrint /> Attestation
                </Button>
                <Button variant="info" size="sm" onClick={() => handlePrintCard(attestation)}>
                  <FaPrint /> Carte
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Attestation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'attestation</Form.Label>
              <Form.Select name="type_attestation" value={formData.type_attestation} onChange={handleChange}>
                <option value="baptême">Baptême</option>
                <option value="mariage">Mariage</option>
                <option value="confirmation">Confirmation</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de délivrance</Form.Label>
              <Form.Control
                type="date"
                name="date_delivrance"
                value={formData.date_delivrance}
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
                    {chretien.nom} {chretien.prenom}
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
          <Modal.Title>Modifier une Attestation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'attestation</Form.Label>
              <Form.Select name="type_attestation" value={formData.type_attestation} onChange={handleChange}>
                <option value="baptême">Baptême</option>
                <option value="mariage">Mariage</option>
                <option value="confirmation">Confirmation</option>
                <option value="autre">Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de délivrance</Form.Label>
              <Form.Control
                type="date"
                name="date_delivrance"
                value={formData.date_delivrance}
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
                    {chretien.nom} {chretien.prenom}
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

export default AttestationList;