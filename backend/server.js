const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const chretienRoutes = require('./routes/chretien');
const evenementRoutes = require('./routes/evenement');
const financeRoutes = require('./routes/finance');
const egliseRoutes = require('./routes/eglise');
const paroisseRoutes = require('./routes/paroisse');
const synodeRoutes = require('./routes/synode');
const attestationRoutes = require('./routes/attestation');
const visiteurRoutes = require('./routes/visiteur');
const roleRoutes = require('./routes/role');
const utilisateurRoutes = require('./routes/utilisateur'); // Ajout de la route utilisateur

const app = express();

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes existantes
app.use('/api/chretiens', chretienRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/eglises', egliseRoutes);
app.use('/api/paroisses', paroisseRoutes);
app.use('/api/synodes', synodeRoutes);
app.use('/api/attestations', attestationRoutes);
app.use('/api/visiteurs', visiteurRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/utilisateurs', utilisateurRoutes); // Nouvelle route ajoutée

// Routes pour le dashboard
// Statistiques des finances
app.get('/api/stats/finances', (req, res) => {
  const query = `
    SELECT 
      e.nom AS eglise,
      SUM(CASE WHEN f.type IN ('donation', 'collecte') THEN f.montant ELSE 0 END) AS entrant,
      SUM(CASE WHEN f.type = 'dépense' THEN f.montant ELSE 0 END) AS sortant
    FROM Finance f
    LEFT JOIN Eglise e ON f.id_eglise = e.id_eglise
    GROUP BY e.id_eglise, e.nom
  `;
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Statistiques des chrétiens
app.get('/api/stats/chretiens', (req, res) => {
  const query = `
    SELECT 
      statut,
      COUNT(*) AS nombre
    FROM Chretien
    GROUP BY statut
  `;
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Événements à venir (prochains 30 jours)
app.get('/api/stats/evenements', (req, res) => {
  const query = `
    SELECT 
      e.type_evenement,
      e.date_evenement,
      e.description,
      c.nom AS chretien_nom,
      c.prenom AS chretien_prenom
    FROM Evenement e
    LEFT JOIN Chretien c ON e.id_chretien = c.id_chretien
    WHERE e.date_evenement >= CURDATE() 
    AND e.date_evenement <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY e.date_evenement ASC
  `;
  req.db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.send("API de gestion d'église en ligne");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});