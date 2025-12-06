const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); 
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
    res.send('Hello! Backend is running...');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: 'Database Connected!', 
            time: result.rows[0].now 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});