const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Configure dotenv
dotenv.config();

// Rest object
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Student Routes
app.use('/api/v1/student', require('./routes/studentRoutes'));
// Use user routes
app.use('/api/v1/user', userRoutes);

// Test Route
app.get("/test", (req, res) => {
    res.status(200).send("<h1>Nodejs Mysql APP</h1>");
});

// Port
const PORT = process.env.PORT || 3030;

// Conditionally listen
mySqlPool.query('SELECT 1')
    .then(() => {
        console.log('MySQL database connection established');

        // Listen
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error establishing MySQL connection:', error);
    });
