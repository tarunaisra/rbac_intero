//import .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Diimpor
const JWT_SECRET = process.env.JWT_SECRET;
const { authenticateToken, authorizeRole } = require("./middleware/auth.js");
//import database
const db = require("./database.js");

const app = express();
const PORT = process.env.PORT || 3200;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk otentikasi token
// Middleware untuk otentikasi token
// app.use(authenticateToken); // Dihapus agar tidak memblokir login/register

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Movie Director API!",
    endpoints: {
      "GET /status": "Check API status",
      "POST /register": "Register a new user",
      "POST /login": "Login to get a JWT token",
       "GET /directors": "Get a list of all directors (protected)",
      "GET /directors/:id": "Get a single director by ID (protected)",
      "POST /directors": "Add a new director (protected)",
      "PUT /directors/:id": "Update a director by ID (protected)",
      "DELETE /directors/:id": "Delete a director by ID (protected, admin only)"
    },
  });
});

app.get("/status", (req, res) => {
  res.json({ ok: true, status: "Server is running", service: "Movie API" });
});

// auth register

// auth register
app.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Failed to process registration" });
    }
    const sql = "INSERT INTO users (username, password, role) VALUES (?,?,?)";
    const params = [username.toLowerCase(), hashedPassword, "user"];
    db.run(sql, params, function (err) {
      if (err) {
        if (err.message.includes(`UNIQUE constraint`)) {
          return res.status(409).json({ error: "Username already exists" });
        }
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ error: "Failed to process registration" });
      }
      res
        .status(201)
        .json({ message: "User registered successfully", userId: this.lastID });
    });
  });
});

//auth register admin
app.post("/auth/register-admin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Failed to process registration" });
    }
    const sql = "INSERT INTO users (username, password, role) VALUES (?,?,?)";
    const params = [username.toLowerCase(), hashedPassword, "admin"];
    db.run(sql, params, function (err) {
      if (err) {
        if (err.message.includes(`UNIQUE constraint`)) {
          return res.status(409).json({ error: "Username already exists" });
        }
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ error: "Failed to process registration" });
      }
      res
        .status(201)
        .json({ message: "User registered successfully", userId: this.lastID });
    });
  });
});

//login
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username or password is missing" });
  }
  const sql = " SELECT * FROM users WHERE username = ?";
  db.get(sql, [username.toLowerCase()], (err, user) => {
    if (err || !user) {
      return res
        .status(401)
        .json({ error: "Username or password is incorrect" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res
          .status(401)
          .json({ error: "Username or password is incorrect" });
      }
      // Payload JWT yang diperbaiki: aman dan benar
      const payload = {
        user: { id: user.id, username: user.username, role: user.role },
      };
      jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          console.error("Error signing token:", err);
          return res.status(500).json({ error: "Failed to generate token" });
        }
        res.json({ message: "Login successful", token: token });
      });
    });
  });
});

// GET all directors
app.get("/directors", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM directors ORDER BY id ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "success", data: rows });
  });
});

// GET director by ID
app.get("/directors/:id", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM directors WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "success", data: row });
  });
});

// CREATE director
app.post("/directors", authenticateToken, (req, res) => {
  const { name, nationality, birthYear } = req.body;
  const sql = "INSERT INTO directors (name, nationality, birthYear) VALUES (?,?,?)";

  db.run(sql, [name, nationality, birthYear], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ 
      message: "Director created successfully", 
      directorId: this.lastID 
    });
  });
});

// UPDATE director
app.put("/directors/:id", authenticateToken, (req, res) => {
  const { name, nationality, birthYear } = req.body;
  const sql =
    "UPDATE directors SET name = ?, nationality = ?, birthYear = ? WHERE id = ?";
  
  db.run(sql, [name, nationality, birthYear, req.params.id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Director not found" });
    }
    res.json({ 
      message: "Director updated successfully", 
      changes: this.changes 
    });
  });
});

// DELETE director (ADMIN ONLY)
app.delete(
  "/directors/:id",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    const sql = "DELETE FROM directors WHERE id = ?";
    db.run(sql, req.params.id, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Director not found" });
      }
      res.json({
        message: "Director deleted successfully",
        changes: this.changes,
      });
    });
  }
);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
