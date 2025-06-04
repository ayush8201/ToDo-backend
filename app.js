const express = require("express");
const dotenv = require("dotenv");
const conn = require("./conn/conn");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cors = require("cors");
const app = express();
dotenv.config();

// CORS configuration
app.use(cors({
  origin: ['https://to-do-frontend-ivory-mu.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

conn();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("running fine backend"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;