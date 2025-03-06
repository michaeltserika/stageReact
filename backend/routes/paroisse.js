const express = require('express');
const router = express.Router();

// GET toutes les paroisses
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Paroisse';
  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET une paroisse par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Paroisse WHERE id_paroisse = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Paroisse non trouvée' });
    res.json(result[0]);
  });
});

// POST ajouter une paroisse
router.post('/', (req, res) => {
  const { nom, adresse, id_synode } = req.body;
  if (!nom || !adresse || !id_synode) {
    return res.status(400).json({ error: 'Tous les champs (nom, adresse, id_synode) sont requis' });
  }
  const query = 'INSERT INTO Paroisse (nom, adresse, id_synode) VALUES (?, ?, ?)';
  req.db.query(query, [nom, adresse, id_synode], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier une paroisse
router.put('/:id', (req, res) => {
  const { nom, adresse, id_synode } = req.body;
  if (!nom || !adresse || !id_synode) {
    return res.status(400).json({ error: 'Tous les champs (nom, adresse, id_synode) sont requis' });
  }
  const query = 'UPDATE Paroisse SET nom = ?, adresse = ?, id_synode = ? WHERE id_paroisse = ?';
  req.db.query(query, [nom, adresse, id_synode, req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Paroisse non trouvée' });
    res.json({ message: 'Paroisse modifiée avec succès' });
  });
});

// DELETE supprimer une paroisse
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Paroisse WHERE id_paroisse = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Paroisse non trouvée' });
    res.json({ message: 'Paroisse supprimée avec succès' });
  });
});

module.exports = router;