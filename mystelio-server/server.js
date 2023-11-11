const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: ", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Routes
const authRoutes = require("./routes/authurls");
const apiroutes = require("./routes/api");

app.use("/auth", authRoutes);
app.use("/vaayu", apiroutes);

app.get("/", (req, res) => {
  res.send("Welcome to Mystelio API");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
