const express = require('express');
const cors = require('cors');
const mongoConnect = require('./db');
const dataRoutes = require('./routes/data.routes');
const { fetchAndSaveData } = require('./models/data.models');
const apiCallRequest = false;

require('dotenv').config();

const app = express();

if (apiCallRequest) fetchAndSaveData();
mongoConnect();
app.use(cors());
app.use(express.json());
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server established on port: ${PORT}`);
});
