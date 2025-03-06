const express = require('express');
const router = express.Router();

// POST login
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;
  const query = 'SELECT * FROM Utilisateur WHERE email = ? AND mot_de_passe = ?';
  req.db.query(query, [email, mot_de_passe], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    res.json({ success: true, utilisateur: results[0] });
  });
});

// POST inscription
router.post('/register', (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  const query = 'INSERT INTO Utilisateur (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)';
  req.db.query(query, [nom, email, mot_de_passe, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ success: true, message: 'Utilisateur inscrit avec succès' });
  });
});

module.exports = router;