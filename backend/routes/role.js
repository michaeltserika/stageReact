const express = require('express');
const router = express.Router();

// GET tous les rôles
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Role';
  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err.message); // Log pour débogage
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET un rôle par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Role WHERE id_role = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.json(result[0]);
  });
});

// POST ajouter un rôle
router.post('/', (req, res) => {
  const { libelle } = req.body; // Changé de "nom" à "libelle", supprimé "description"
  if (!libelle) return res.status(400).json({ error: 'Le libellé est requis' });
  const query = 'INSERT INTO Role (libelle) VALUES (?)'; // Mise à jour de la requête
  req.db.query(query, [libelle], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// PUT modifier un rôle
router.put('/:id', (req, res) => {
  const { libelle } = req.body; // Changé de "nom" à "libelle", supprimé "description"
  if (!libelle) return res.status(400).json({ error: 'Le libellé est requis' });
  const query = 'UPDATE Role SET libelle = ? WHERE id_role = ?'; // Mise à jour de la requête
  req.db.query(query, [libelle, req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.json({ message: 'Rôle modifié avec succès' });
  });
});

// DELETE supprimer un rôle
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM Role WHERE id_role = ?';
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.json({ message: 'Rôle supprimé avec succès' });
  });
});

module.exports = router;