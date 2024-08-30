const express = require('express');
const quizRouter = express.Router();

// Import the controller functions
const {
    createQuiz,
    deleteQuiz,
    getQuiz,
    allQuiz,
    addAttemptedQuestion,
    addImpression,
    updateQuiz,
    addCorrectAnswer,
    addWrongAnswer,
    polledOptions,
} = require('../controller/quiz'); // Adjust the path accordingly
const verifyToken = require('../middleware/auth');

// Routes for quiz
quizRouter.post('/quiz', verifyToken, createQuiz);                       // Create a new quiz
quizRouter.delete('/quiz/:id', verifyToken, deleteQuiz);                // Delete a quiz by ID
quizRouter.get('/quiz/:id', getQuiz);                      // Get a quiz by ID
quizRouter.get('/quiz', verifyToken, allQuiz);                          // Get all quiz
quizRouter.put('/quiz/:id', verifyToken, updateQuiz);                   // Update a quiz by ID

// Routes for quiz operations
quizRouter.post('/quiz/:quizId/attempted-questions/:questionIndex', addAttemptedQuestion); // Add attempted question 
quizRouter.post('/quiz/:id/impressions', addImpression);    // Add impression count
quizRouter.post('/quiz/:quizId/correct-answers/:questionIndex', addCorrectAnswer); // Add correct answer count
quizRouter.post('/quiz/:quizId/wrong-answers/:questionIndex', addWrongAnswer); // Add wrong answer count
// Routes for poll options
quizRouter.post('/quiz/:quizId/questions/:questionIndex/poll-options/:optionIndex', polledOptions); // Poll an option

module.exports = quizRouter