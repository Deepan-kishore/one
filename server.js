// const express = require('express');
const express = require('express')
const jwt = require('jsonwebtoken')
const  RolesModel = require('./models/roles');
// import jwt from 'jsonwebtoken';

const app = express();
const router = express.Router();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log(token);

  if (!token) return res.json({ message: 'Unauthorized' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.json({ message: 'Forbidden', error: err });
    if (user.username !== 'admin') return res.json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes
router.post('/profile', (req, res) => {
  res.json({ req: req.body });
});

router.all('/', (_req, res) => {
  res.json({ message: 'Welcome to the server' });
});



router.post('/signin', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password, req.params);

  if (username !== 'admin' && password !== 'admin') {
    res.json({ message: 'Invalid username or password' });
  }
const role = RolesModel.getRoles(username)
if (!role) {
  res.json({message:"Role not found"})
}
  jwt.sign({ username,role }, 'secretKey', { expiresIn: '1h' }, (err, token) => {
    if (err) {
      res.json({ message: 'Error creating token' });
    }

    res.json({ message: 'Sign in successful', token });
  });
});

router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  console.log(username, password, role, "calling model");
  
  if (!username || !password) {
    res.json({ message: 'username or password not provided' });
  }
  const create_model_response = RolesModel.addRole(username,role)
  console.log("model created",create_model_response);
  
  res.json({ message: 'User registered',  create_model_response  });
});

router.all('/protected', authenticateToken, (req, res, next) => {
  res.status(200).json({
    status:200,
    data: req.user });
  next();
});

router.get('/protected', (_req, res) => {
  res.json({ message: 'This is a protected route' });
});


app.listen(3008, () => console.log('Server running on port 3008'));
