const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./DB/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
connectDB();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
