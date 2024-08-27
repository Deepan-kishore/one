// packages
const express = require('express');
const http = require('http')
const mongoose = require('mongoose');
const { couponRouter } = require('./coupon');
const { initiateDB } = require('../controller/DatabaseConfig');

// Connect to MongoDB

initiateDB();

const app = express();
const server = http.createServer(app);
// port
const port = process.env.PORT || 8080;

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});
app.use('/coupon', couponRouter);


server.listen(port,()=> console.log(`Server running on port ${port}`));