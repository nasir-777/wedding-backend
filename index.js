const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const uploadRoute = require('./uploadRoute');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoute);

// Basic health check
app.get('/', (req, res) => {
    res.send('Wedding Backend is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
