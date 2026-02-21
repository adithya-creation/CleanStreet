const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});