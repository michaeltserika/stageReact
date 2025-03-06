const express = require('express');
const router = express.Router();

// GET tous les visiteurs
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Visiteur';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET un visiteur par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Visiteur WHERE id_visiteur = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Visiteur non trouvé' });
    res.json(result[0]);
  });
});

// POST ajouter un visiteur
router.post('/', (req, res) => {
  const { nom, email, message, date_visite } = req.body;
  const query = 'INSERT INTO Visiteur (nom, email, message, date_visite) VALUES (?, ?, ?, ?)';
  req.db.query(query, [nom, email, message, date_visite || new Date()], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier un visiteur
router.put('/:id', (req, res) => {
  const { nom, email, message, date_visite } = req.body;
  const query = 'UPDATE Visiteur SET nom = ?, email = ?, message = ?, date_visite = ? WHERE id_visiteur = ?';
  req.db.query(query, [nom, email, message, date_visite, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Visiteur non trouvé' });
    res.json({ message: 'Visiteur modifié avec succès' });
  });
});

// DELETE supprimer un visiteur
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Visiteur WHERE id_visiteur = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Visiteur non trouvé' });
    res.json({ message: 'Visiteur supprimé avec succès' });
  });
});

module.exports = router;