const express = require('express');
const router = express.Router();

// GET toutes les finances
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Finance';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET une finance par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Finance WHERE id_finance = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Finance non trouvée' });
    res.json(result[0]);
  });
});

// POST ajouter une finance
router.post('/', (req, res) => {
  const { montant, type, date, description, id_eglise } = req.body;
  const query = 'INSERT INTO Finance (montant, type, date, description, id_eglise) VALUES (?, ?, ?, ?, ?)';
  req.db.query(query, [montant, type, date, description, id_eglise], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier une finance
router.put('/:id', (req, res) => {
  const { montant, type, date, description, id_eglise } = req.body;
  const query = 'UPDATE Finance SET montant = ?, type = ?, date = ?, description = ?, id_eglise = ? WHERE id_finance = ?';
  req.db.query(query, [montant, type, date, description, id_eglise, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Finance non trouvée' });
    res.json({ message: 'Finance modifiée avec succès' });
  });
});

// DELETE supprimer une finance
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Finance WHERE id_finance = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Finance non trouvée' });
    res.json({ message: 'Finance supprimée avec succès' });
  });
});

module.exports = router;