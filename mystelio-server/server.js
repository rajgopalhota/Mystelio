const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const http = require("http"); // Require the http module
const socketIo = require("socket.io");
const sequelize = require("./config/database");
const errorMiddleware = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Create a new HTTP server and pass it to socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ORIGIN,
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(errorMiddleware);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sync Sequelize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Socket.io setup
io.on('connection', (socket) => {
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Handle joining a room based on user ID
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });
});

// Send io object to routes to use it for emitting events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const userRoutes = require("./routes/userurls");
const messageRoutes = require("./routes/messageurls");
const followRoutes = require("./routes/followurls");
const postRoutes = require("./routes/posturls");
const commentRoutes = require("./routes/commenturls");
const songRoutes = require("./routes/songurls");

app.use("/auth", userRoutes);
app.use("/friend", followRoutes);
app.use("/posts", postRoutes);
app.use("/comment", commentRoutes);
app.use("/dm", messageRoutes);
app.use("/music", songRoutes);

// Serve your HTML file
app.get("/", (req, res) => {
  const htmlPath = path.join(__dirname, "home", "index.html");
  res.sendFile(htmlPath);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
