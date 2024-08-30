const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [Object],
    answer: Number,
    optionType: String,
    timer: { type: Number, default: null }, // Timer can be a Number or null
    totalAttempted: { type: Number, default: 0 },  // Tracks how many times this question is attempted
    correctAnswers: { type: Number, default: 0 },  // Tracks the number of correct answers
    wrongAnswers: { type: Number, default: 0 },    // Tracks the number of wrong answers
    optionCounts: { type: [], default: [] }, // Array to track counts for each option
});

const quizSchema = new mongoose.Schema({
    impressions: { type: Number, default: 0 },     // Tracks how many times the quiz is viewed
    quizName: { type: String, required: true },
    quizType: { type: String, required: true },
    questions: [questionSchema],  // Embeds the questionSchema within the quizSchema
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
