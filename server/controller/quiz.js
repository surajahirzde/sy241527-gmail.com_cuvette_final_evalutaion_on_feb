const Quiz = require("../model/quiz");
const mongoose = require('mongoose');

const createQuiz = async (req, res) => {
    const { quizName, quizType, questions } = req.body;

    if (!quizName || !quizType || !questions) {
        return res.status(400).json({
            code: 400,
            message: "All fields are required",
        });
    }

    const newQuiz = new Quiz({
        quizName,
        quizType,
        questions,
        creator: req.user._id,
    });

    try {
        await newQuiz.save();
        res.status(201).json({
            code: 201,
            message: "Quiz created successfully",
            quizId: newQuiz._id
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID is required",
        });
    }

    try {
        const result = await Quiz.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({
                code: 404,
                message: "Quiz not found",
            });
        }
        res.status(200).json({
            code: 200,
            message: "Quiz deleted successfully"
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const getQuiz = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID is required",
        });
    }

    try {
        const quiz = await Quiz.findById({ _id: id });
        if (!quiz) {
            return res.status(404).json({
                code: 404,
                message: "Quiz not found",
            });
        }
        res.status(200).json({
            code: 200,
            message: "Quiz fetched successfully",
            data: quiz
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const updateQuiz = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID is required",
        });
    }

    try {
        const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        if (!quiz) {
            return res.status(404).json({
                code: 404,
                message: "Quiz not found",
            });
        }
        res.status(200).json({
            code: 200,
            message: "Quiz updated successfully",
            quizId: id
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const allQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ creator: req.user._id });
        res.status(200).json({
            code: 200,
            message: "Quizzes fetched successfully",
            data: quizzes
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const addImpression = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID is required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            code: 404,
            message: "Invalid Quiz ID format",
        });
    }

    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({
                code: 404,
                message: "Quiz not found",
            });
        }

        quiz.impressions = (quiz.impressions || 0) + 1; // Ensure default value is 0 if not set
        await quiz.save();

        res.status(200).json({
            code: 200,
            message: "Quiz impression added successfully",
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const updateQuestionMetrics = async (quizId, questionIndex, updateField) => {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new Error('Quiz not found');
    }

    const question = quiz.questions[questionIndex];
    if (!question) {
        throw new Error('Question not found');
    }

    if (updateField === 'attemptedQuestions') {
        question.totalAttempted = (question.totalAttempted || 0) + 1;
    } else if (updateField === 'correctAnswers') {
        question.correctAnswers = (question.correctAnswers || 0) + 1;
    } else if (updateField === 'wrongAnswers') {
        question.wrongAnswers = (question.wrongAnswers || 0) + 1;
    }

    await quiz.save();
};

const addAttemptedQuestion = async (req, res) => {
    const { quizId, questionIndex } = req.params;

    if (!quizId || questionIndex === undefined) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID and question index are required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({
            code: 400,
            message: "Invalid Quiz ID format",
        });
    }

    try {
        await updateQuestionMetrics(quizId, parseInt(questionIndex), 'attemptedQuestions');
        res.status(200).json({
            code: 200,
            message: "Question attempted count updated successfully",
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const addCorrectAnswer = async (req, res) => {
    const { quizId, questionIndex } = req.params;

    if (!quizId || questionIndex === undefined) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID and question index are required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({
            code: 400,
            message: "Invalid Quiz ID format",
        });
    }

    try {
        await updateQuestionMetrics(quizId, parseInt(questionIndex), 'correctAnswers');
        res.status(200).json({
            code: 200,
            message: "Question correct answer count updated successfully",
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const addWrongAnswer = async (req, res) => {
    const { quizId, questionIndex } = req.params;

    if (!quizId || questionIndex === undefined) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID and question index are required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({
            code: 400,
            message: "Invalid Quiz ID format",
        });
    }

    try {
        await updateQuestionMetrics(quizId, parseInt(questionIndex), 'wrongAnswers');
        res.status(200).json({
            code: 200,
            message: "Question wrong answer count updated successfully",
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};

const polledOptions = async (req, res) => {
    const { quizId, questionIndex, optionIndex } = req.params;

    if (!quizId || questionIndex === undefined || optionIndex === undefined) {
        return res.status(400).json({
            code: 400,
            message: "Quiz ID, question index, and option index are required",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({
            code: 400,
            message: "Invalid Quiz ID format",
        });
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                code: 404,
                message: "Quiz not found",
            });
        }

        const question = quiz.questions[questionIndex];
        if (!question) {
            return res.status(404).json({
                code: 404,
                message: "Question not found",
            });
        }

        if (quiz.quizType !== 'Poll Type') {
            return res.status(400).json({
                code: 400,
                message: "The question type is not a poll",
            });
        }

        if (optionIndex < 0 || optionIndex >= question.options.length) {
            return res.status(400).json({
                code: 400,
                message: "Invalid option index",
            });
        }

        // Initialize optionCounts if not present
        if (!question.optionCounts || question.optionCounts.length !== question.options.length) {
            question.optionCounts = new Array(question.options.length).fill(0);
        }

        // Increment the count for the selected option
        question.optionCounts[optionIndex] += 1;

        await quiz.save();

        res.status(200).json({
            code: 200,
            message: "Option polled successfully",
            data: {
                option: question.options[optionIndex],
                count: question.optionCounts[optionIndex] // Corrected count retrieval
            }
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: err.message
        });
    }
};


module.exports = {
    createQuiz,
    deleteQuiz,
    getQuiz,
    allQuiz,
    addAttemptedQuestion,
    addImpression,
    updateQuiz,
    addCorrectAnswer,
    addWrongAnswer, // Added missing function
    polledOptions
};
