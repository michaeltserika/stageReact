const express = require('express');
const router = express.Router();

// GET tous les événements
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Evenement';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET un événement par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Evenement WHERE id_evenement = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json(result[0]);
  });
});

// POST ajouter un événement
router.post('/', (req, res) => {
  const { type_evenement, date_evenement, description, id_chretien } = req.body;
  const query = 'INSERT INTO Evenement (type_evenement, date_evenement, description, id_chretien) VALUES (?, ?, ?, ?)';
  req.db.query(query, [type_evenement, date_evenement, description, id_chretien], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier un événement
router.put('/:id', (req, res) => {
  const { type_evenement, date_evenement, description, id_chretien } = req.body;
  const query = 'UPDATE Evenement SET type_evenement = ?, date_evenement = ?, description = ?, id_chretien = ? WHERE id_evenement = ?';
  req.db.query(query, [type_evenement, date_evenement, description, id_chretien, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json({ message: 'Événement modifié avec succès' });
  });
});

// DELETE supprimer un événement
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Evenement WHERE id_evenement = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json({ message: 'Événement supprimé avec succès' });
  });
});

module.exports = router;