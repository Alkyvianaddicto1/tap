const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000; // Backend API port

// MongoDB connection
mongoose.connect('mongodb://localhost/godzilla-tap-game', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define player schema
const playerSchema = new mongoose.Schema({
  playerName: String,
  email: String,
  score: Number,
  level: Number,
  maxTaps: Number,
  money: Number,
});

const Player = mongoose.model('Player', playerSchema);

// Routes to handle player data
app.post('/save-progress', async (req, res) => {
  const { playerName, email, score, level, maxTaps, money } = req.body;

  try {
    let player = await Player.findOne({ email });

    if (player) {
      // Update existing player
      player.score = score;
      player.level = level;
      player.maxTaps = maxTaps;
      player.money = money;
      await player.save();
    } else {
      // Create new player
      player = new Player({ playerName, email, score, level, maxTaps, money });
      await player.save();
    }

    res.json({ message: 'Player progress saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving progress', error: err });
  }
});

app.get('/get-progress/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const player = await Player.findOne({ email });

    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
