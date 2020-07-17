const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./DB/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
