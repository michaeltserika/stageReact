const express = require('express');
const router = express.Router();

// GET toutes les attestations
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Attestation';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET une attestation par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Attestation WHERE id_attestation = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Attestation non trouvée' });
    res.json(result[0]);
  });
});

// POST ajouter une attestation
router.post('/', (req, res) => {
  const { type_attestation, date_delivrance, id_chretien } = req.body;
  const query = 'INSERT INTO Attestation (type_attestation, date_delivrance, id_chretien) VALUES (?, ?, ?)';
  req.db.query(query, [type_attestation, date_delivrance, id_chretien], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier une attestation
router.put('/:id', (req, res) => {
  const { type_attestation, date_delivrance, id_chretien } = req.body;
  const query = 'UPDATE Attestation SET type_attestation = ?, date_delivrance = ?, id_chretien = ? WHERE id_attestation = ?';
  req.db.query(query, [type_attestation, date_delivrance, id_chretien, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attestation non trouvée' });
    res.json({ message: 'Attestation modifiée avec succès' });
  });
});

// DELETE supprimer une attestation
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Attestation WHERE id_attestation = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attestation non trouvée' });
    res.json({ message: 'Attestation supprimée avec succès' });
  });
});

module.exports = router;