const express = require('express');
const path = require('path');
const cors = require('cors'); 
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

const db = new sqlite3.Database('playerData.db'); 

// enable CORS 
app.use(cors());

// serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// explicitly handle the root route ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getRandomPlayer', (req, res) => {
    // select a random player from the players in the db
    // NOTE: I am filtering out people whose birthdays are not available/cannot be found (This includes "Sharks" because he has no year associated with his birthday)
    const query = 'SELECT * FROM players WHERE birthday != "N/A" AND summoner != "Sharkz" ORDER BY RANDOM() LIMIT 1';

    db.get(query, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(row);
        }
    });
});

// Endpoint to get details for a specific summoner
app.get('/getSummonerDetails', (req, res) => {
    const requestedSummoner = req.query.guessedSummoner;

    // query the database for details based on summoner name
    db.get(
        'SELECT * FROM players WHERE summoner = ?',
        [requestedSummoner],
        (err, row) => {
            if (err) {
                // handle the error
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else if (row) {
                // if the player is found, send their details
                res.json(row);
            } else {
                // if the player is not found, send an error response
                res.status(404).json({ error: 'Summoner not found' });
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});