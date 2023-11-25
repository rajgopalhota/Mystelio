const express = require('express');
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Routes
const userRoutes = require('./routes/userurls');
const apiroutes = require('./routes/api');
const postRoutes = require('./routes/posturls')

app.use('/auth', userRoutes);
app.use('/vaayu', apiroutes);
app.use('/posts', postRoutes);

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
