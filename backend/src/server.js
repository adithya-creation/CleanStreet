const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount main routes at root
app.use('/', routes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer();

