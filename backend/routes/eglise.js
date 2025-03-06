const express = require('express');
const router = express.Router();

// GET toutes les églises
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Eglise';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET une église par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Eglise WHERE id_eglise = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Église non trouvée' });
    res.json(result[0]);
  });
});

// POST ajouter une église
router.post('/', (req, res) => {
  const { nom, type, id_paroisse, id_synode } = req.body;
  const query = 'INSERT INTO Eglise (nom, type, id_paroisse, id_synode) VALUES (?, ?, ?, ?)';
  req.db.query(query, [nom, type, id_paroisse, id_synode], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier une église
router.put('/:id', (req, res) => {
  const { nom, type, id_paroisse, id_synode } = req.body;
  const query = 'UPDATE Eglise SET nom = ?, type = ?, id_paroisse = ?, id_synode = ? WHERE id_eglise = ?';
  req.db.query(query, [nom, type, id_paroisse, id_synode, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Église non trouvée' });
    res.json({ message: 'Église modifiée avec succès' });
  });
});

// DELETE supprimer une église
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Eglise WHERE id_eglise = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Église non trouvée' });
    res.json({ message: 'Église supprimée avec succès' });
  });
});

module.exports = router;