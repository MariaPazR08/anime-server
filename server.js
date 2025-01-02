const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'anime.json');

// Middleware
app.use(express.json());

// Helper function to read and write JSON file
function readData() {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Rutas CRUD
app.get('/animes', (req, res) => {
    const data = readData();
    res.json(data);
});

app.get('/animes/:identifier', (req, res) => {
    const { identifier } = req.params;
    const data = readData();
    const anime = data[identifier] || Object.values(data).find(a => a.nombre.toLowerCase() === identifier.toLowerCase());
    if (anime) {
        res.json(anime);
    } else {
        res.status(404).json({ message: 'Anime not found' });
    }
});

app.post('/animes', (req, res) => {
    const { id, nombre, genero, año, autor } = req.body;
    const data = readData();
    if (data[id]) {
        return res.status(409).json({ message: 'Anime with this ID already exists' });
    }
    data[id] = { nombre, genero, año, autor };
    writeData(data);
    res.status(201).json({ message: 'Anime created successfully' });
});

app.put('/animes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, genero, año, autor } = req.body;
    const data = readData();
    if (!data[id]) {
        return res.status(404).json({ message: 'Anime not found' });
    }
    data[id] = { ...data[id], nombre, genero, año, autor };
    writeData(data);
    res.json({ message: 'Anime updated successfully' });
});

app.delete('/animes/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    if (!data[id]) {
        return res.status(404).json({ message: 'Anime not found' });
    }
    delete data[id];
    writeData(data);
    res.json({ message: 'Anime deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
