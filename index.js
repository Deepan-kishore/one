const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';
const TOKEN_EXPIRATION = '1h'; // 1 hour

// Middleware to check token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Sign In
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  // Validate username and password
  // ...

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
  res.json({ token });
});

// Refresh Token
app.post('/refresh-token', authenticateToken, (req, res) => {
  const { username } = req.user;
  const newToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
  res.json({ token: newToken });
});

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Public Routes
app.post('/signup', (req, res) => {
  // Handle user registration
  res.send('User registered');
});

app.post('/signout', (req, res) => {
  // Handle user sign out
  res.send('User signed out');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});