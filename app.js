const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./DB/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
connectDB();

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
