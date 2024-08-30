const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes');
const quizRouter = require('./routes/quizRoutes.js');
const path = require('path');

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'));
app.use(cors());
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', quizRouter)
app.all('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            code: 500,
            message: 'Internal server error',
            error: err
        })
    }
    next(err)
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
