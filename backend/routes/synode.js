const express = require('express');
const router = express.Router();

// GET tous les synodes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Synode';
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET un synode par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Synode WHERE id_synode = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Synode non trouvé' });
    res.json(result[0]);
  });
});

// POST ajouter un synode
router.post('/', (req, res) => {
  const { nom, adresse } = req.body;
  const query = 'INSERT INTO Synode (nom, adresse) VALUES (?, ?)';
  req.db.query(query, [nom, adresse], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier un synode
router.put('/:id', (req, res) => {
  const { nom, adresse } = req.body;
  const query = 'UPDATE Synode SET nom = ?, adresse = ? WHERE id_synode = ?';
  req.db.query(query, [nom, adresse, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Synode non trouvé' });
    res.json({ message: 'Synode modifié avec succès' });
  });
});

// DELETE supprimer un synode
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Synode WHERE id_synode = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Synode non trouvé' });
    res.json({ message: 'Synode supprimé avec succès' });
  });
});

module.exports = router;