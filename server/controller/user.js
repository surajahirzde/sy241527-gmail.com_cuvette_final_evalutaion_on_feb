const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // Basic validations
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await user.save();

        res.status(201).json({
            code: 201,
            message: 'User registered successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Log in a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validations
    if (!email || !password) {
        return res.status(400).json({ code: 400, message: 'Please enter all fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            message: 'Please enter a valid email address'
        });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ code: 400, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ code: 400, message: 'Invalid credentials' });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.status(200).json({ code: 200, message: 'Login successful for 3 hours', token: token });
    } catch (error) {
        res.status(500).json({ code: 500, message: 'Server error' });
    }
};
