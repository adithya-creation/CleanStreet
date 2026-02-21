const express = require('express');
const cors = require('cors');
const routes = require('./routes');

require("dotenv").config();
const connectDB = require("../config/db");

const app = express();

// CONNECT DATABASE
connectDB();

app.use(cors());
app.use(express.json());

// Mount main routes at root
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});