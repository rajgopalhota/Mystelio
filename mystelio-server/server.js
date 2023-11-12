const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Routes
const authRoutes = require('./routes/authurls');
const apiroutes = require('./routes/api');

app.use('/auth', authRoutes);
app.use('/vaayu', apiroutes);

app.get('/', (req, res) => {
  res.send('Welcome to Mystelio API');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
