// server.js
const express = require('express');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html on root path
});


app.listen(3000, () => console.log('Server running on port 3000'));


app.post('/generate_music', (req, res) => {
    const inputData = req.body;
    console.log('Data received:', inputData);

    // Call a function to process inputData and generate music
    // This is a placeholder - you'll need to implement generateMusic
    const musicData = generateMusic(inputData);

    // Send generated music data back to frontend
    res.json({ musicData: musicData });
});

// Dummy function - replace this with actual music generation logic
function generateMusic(data) {
    // Implement music generation logic using Magenta.js here
    return { /* ... generated music data ... */ };
}