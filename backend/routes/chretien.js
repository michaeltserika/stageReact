const express = require('express');
const router = express.Router();

// GET tous les chrétiens
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Chretien';
  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET un chrétien par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Chretien WHERE id_chretien = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Chrétien non trouvé' });
    res.json(result[0]);
  });
});

// POST ajouter un chrétien
router.post('/', (req, res) => {
  const { nom, prenom, date_naissance, adresse, contact, statut, id_eglise, date_adhesion } = req.body;
  const query = `
    INSERT INTO Chretien (nom, prenom, date_naissance, adresse, contact, statut, id_eglise, date_adhesion) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  req.db.query(query, [nom, prenom, date_naissance, adresse, contact, statut, id_eglise, date_adhesion], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier un chrétien
router.put('/:id', (req, res) => {
  const { nom, prenom, date_naissance, adresse, contact, statut, id_eglise, date_adhesion } = req.body;
  const query = `
    UPDATE Chretien 
    SET nom = ?, prenom = ?, date_naissance = ?, adresse = ?, contact = ?, statut = ?, id_eglise = ?, date_adhesion = ? 
    WHERE id_chretien = ?
  `;
  req.db.query(query, [nom, prenom, date_naissance, adresse, contact, statut, id_eglise, date_adhesion, req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Chrétien non trouvé' });
    res.json({ message: 'Chrétien modifié avec succès' });
  });
});

// DELETE supprimer un chrétien
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Chretien WHERE id_chretien = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Chrétien non trouvé' });
    res.json({ message: 'Chrétien supprimé avec succès' });
  });
});

// POST associer un rôle à un chrétien
router.post('/:id/roles', (req, res) => {
  const { id_role } = req.body;
  const id_chretien = req.params.id;
  const query = 'INSERT INTO Chretien_Role (id_chretien, id_role) VALUES (?, ?)';
  req.db.query(query, [id_chretien, id_role], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Rôle associé avec succès' });
  });
});

// GET rôles d’un chrétien
router.get('/:id/roles', (req, res) => {
  const query = `
    SELECT r.id_role, r.libelle 
    FROM Chretien_Role cr 
    JOIN Role r ON cr.id_role = r.id_role 
    WHERE cr.id_chretien = ?
  `;
  req.db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// DELETE tous les rôles d’un chrétien (pour mise à jour)
router.delete('/:id/roles', (req, res) => {
  const query = 'DELETE FROM Chretien_Role WHERE id_chretien = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Rôles supprimés avec succès' });
  });
});

module.exports = router;