const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            success: false,
            message: 'Username and password are required',
        });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            data: { id: result.insertId, username },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            success: false,
            message: 'Username and password are required',
        });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        const user = rows[0];

        // Compare hashed password with the entered password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid password',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            token, // Return the token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};


module.exports = { registerUser, loginUser };
