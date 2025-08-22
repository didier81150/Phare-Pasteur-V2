const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
// Augmenter la limite pour les données potentiellement volumineuses comme les logos en base64
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(express.static(__dirname)); // Servir les fichiers statiques du dossier v2

// API pour obtenir l'état actuel de l'application
app.get('/api/state', (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture de la base de données :", err);
            return res.status(500).json({ error: 'Impossible de lire les données depuis le serveur.' });
        }
        res.json(JSON.parse(data));
    });
});

// API pour mettre à jour l'état de l'application
app.post('/api/state', (req, res) => {
    const newState = req.body;

    // Validation simple pour s'assurer que les données ne sont pas corrompues
    if (!newState || typeof newState.studentsList === 'undefined' || typeof newState.reportsList === 'undefined') {
        return res.status(400).json({ error: 'Données reçues invalides.' });
    }

    fs.writeFile(DB_PATH, JSON.stringify(newState, null, 2), 'utf8', (err) => {
        if (err) {
            console.error("Erreur d'écriture dans la base de données :", err);
            return res.status(500).json({ error: 'Impossible de sauvegarder les données sur le serveur.' });
        }
        res.json({ success: true, message: 'État sauvegardé avec succès.' });
    });
});

// Servir le fichier principal index.html pour la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Le serveur de l'application Anti-Harcèlement V2 est démarré sur http://localhost:${PORT}`);
});
