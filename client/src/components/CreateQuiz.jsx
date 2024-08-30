import { useEffect, useRef, useState } from "react";
import "./styles/CreateQuiz.css";
import PlusBtn from "../assets/add.svg";
import Cross from "../assets/charm_cross.svg";
import DeleteIcon from "../assets/vector.svg"; // Import the delete icon
import PropTypes from "prop-types";
import Notification from "../Utils/Notification";
import { checkLogin, getCookie } from "../helper/mainFunction";
import Loader from "../helper/Loader";

const CreateQuiz = ({ func }) => {
  const [quiz, setQuiz] = useState({
    quizName: "",
    quizType: "",
    questions: [],
  });
  const [publishLink, setPublishLink] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [questionId, setQuestionId] = useState(1);
  const [loading, setLoading] = useState(false);
  const QuizRef = useRef(null);

  useEffect(() => {
    checkLogin();
  }, []);
  const stepBack = () => {
    setStep(1);
    setQuestionId(1);
    setQuiz((pre) => {
      return {
        ...pre,
        questions: [],
      };
    });
  };

  const optionTypeSet = (type) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              optionType: type,
            }
          : question
      ),
    }));
  };

  const hidePopup = (event) => {
    if (QuizRef.current && !QuizRef.current.contains(event.target)) {
      func();
    }
  };

  const checkValidate = () => {
    if (quiz.quizName && quiz.quizType) {
      setStep(2);
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: [
          ...prevQuiz.questions,
          {
            id: questionId,
            question: "",
            options: [],
            answer: null,
            optionType: null,
            timer: null,
          },
        ],
      }));
    } else {
      alert("Please fill all the fields");
    }
  };

  const deleteOption = (optionIndex) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : question
      ),
    }));
  };

  const addOption = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [...question.options, ""],
            }
          : question
      ),
    }));
  };

  const deleteQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter(
        (question) => question.id !== questionId
      ),
    }));
    setQuestionId((prevId) => Math.max(prevId - 1, 1)); // Ensure questionId does not go below 1
  };

  const addQuestion = () => {
    if (quiz.questions.length >= 5) {
      alert("Maximum of 5 questions allowed.");
      return;
    }

    if (!validateCurrentQuestion()) {
      return; // Exit if validation fails
    }

    setQuestionId(quiz?.questions.length + 1);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        {
          id: questionId + 1,
          question: "",
          options: [],
          answer: null,
          optionType: null,
          timer: null,
        },
      ],
    }));
  };

  const handleQuestionChange = (e) => {
    const newQuestionText = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              question: newQuestionText,
            }
          : question
      ),
    }));
  };

  const correctAnswer = (index) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answer: index,
            }
          : question
      ),
    }));
  };

  const handleOptionChange = (index, e, field) => {
    const newOptionValue = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, i) =>
                i === index ? { ...opt, [field]: newOptionValue } : opt
              ),
            }
          : question
      ),
    }));
  };

  const updateTimer = (time) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              timer: time,
            }
          : question
      ),
    }));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publishLink);
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 5000);
  };

  const validateCurrentQuestion = () => {
    const currentQuestion = quiz.questions[questionId - 1];

    // Check if the question text is filled
    if (!currentQuestion.question) {
      alert("Please fill in the question text.");
      return false;
    }

    // Check if the option type is selected
    if (!currentQuestion.optionType) {
      alert("Please select an option type.");
      return false;
    }

    // Check if at least two options are filled
    if (currentQuestion.options.length < 2) {
      alert("Please provide at least two options.");
      return false;
    }

    // Check if any option is empty
    if (currentQuestion.options.some((opt) => opt === "")) {
      alert("Please fill all option fields.");
      return false;
    }

    // Check if a correct answer is selected
    if (quiz.quizType === "Q & A" && currentQuestion.answer === null) {
      alert("Please select a correct answer.");
      return false;
    }

    return true;
  };

  const validateQuizBeforeCreation = () => {
    // Validate quiz name and type
    if (!quiz.quizName) {
      alert("Please enter a quiz name.");
      return false;
    }

    if (!quiz.quizType) {
      alert("Please select a quiz type.");
      return false;
    }

    // Validate each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const currentQuestion = quiz.questions[i];
      const isValid = validateCurrentQuestion(currentQuestion);
      if (!isValid) {
        alert(`Validation failed for question ${i + 1}. Please check.`);
        return false;
      }
    }

    return true;
  };

  const sendQuizToApi = async (quizData) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("token"),
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const result = await response.json();
      setPublishLink(import.meta.env.VITE_MY_URL + "/quiz/" + result.quizId); // Assuming API returns a link
      setStep(3);
    } catch (error) {
      console.error("Failed to send quiz data:", error);
      alert("Failed to create quiz. Please try again.");
    }
    setLoading(false);
  };

  const createQuiz = () => {
    // Check if all validations pass before creating the quiz
    if (validateQuizBeforeCreation()) {
      console.log(quiz);
      sendQuizToApi(quiz);
    }
  };

  return (
    <section className="create-quiz" onClick={hidePopup}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {step === 1 && (
            <div className="createQuizWrapper" ref={QuizRef}>
              <input
                type="text"
                placeholder="Quiz name"
                value={quiz?.quizName}
                onChange={(e) => {
                  setQuiz((prevQuiz) => ({
                    ...prevQuiz,
                    quizName: e.target.value,
                  }));
                }}
              />
              <div className="quizType">
                <label htmlFor="quizType">Quiz Type</label>
                <input
                  className={quiz.quizType === "Q & A" ? "selected" : ""}
                  type="button"
                  value="Q & A"
                  onClick={(e) =>
                    setQuiz((prevQuiz) => ({
                      ...prevQuiz,
                      quizType: e.target.value,
                    }))
                  }
                />
                <input
                  className={quiz.quizType === "Poll Type" ? "selected" : ""}
                  type="button"
                  value="Poll Type"
                  onClick={(e) =>
                    setQuiz((prevQuiz) => ({
                      ...prevQuiz,
                      quizType: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="actionBtns">
                <button onClick={func}>Cancel</button>
                <button onClick={checkValidate}>Continue</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="addQuestions createQuizWrapper" ref={QuizRef}>
              <div className="questionsWrapper">
                <div className="questionHeader">
                  <div className="questionCount">
                    {quiz.questions.map((_, index) => (
                      <div
                        key={index}
                        className="count"
                        onClick={() => setQuestionId(index + 1)}
                      >
                        <span>{index + 1}</span>
                        {quiz?.questions[questionId - 1] ===
                          quiz.questions[index] && (
                          <div className="delete" onClick={deleteQuestion}>
                            <img src={Cross} alt="delete question" />
                          </div>
                        )}
                      </div>
                    ))}
                    {quiz.questions.length < 5 && (
                      <div className="addBtn" onClick={addQuestion}>
                        <img src={PlusBtn} alt="add question" />
                      </div>
                    )}
                  </div>
                  <p>Max 5 questions</p>
                </div>
                <div className="questionContainer">
                  <input
                    type="text"
                    placeholder={
                      quiz.quizType === "Q & A" ? "Question" : "Poll"
                    }
                    onChange={handleQuestionChange}
                    value={quiz.questions[questionId - 1]?.question || ""}
                  />
                  <div className="optionType">
                    <label htmlFor="optionType">Option Type</label>
                    <div className="typeGroup">
                      <input
                        type="radio"
                        name="optionType"
                        id="text"
                        checked={
                          quiz.questions[questionId - 1]?.optionType === "text"
                        }
                        onChange={() => optionTypeSet("text")}
                      />
                      <label htmlFor="text">Text</label>
                    </div>
                    <div className="typeGroup">
                      <input
                        type="radio"
                        name="optionType"
                        id="image"
                        checked={
                          quiz.questions[questionId - 1]?.optionType === "image"
                        }
                        onChange={() => optionTypeSet("image")}
                      />
                      <label htmlFor="image">Image URL</label>
                    </div>
                    <div className="typeGroup">
                      <input
                        type="radio"
                        name="optionType"
                        id="T&I"
                        checked={
                          quiz.questions[questionId - 1]?.optionType ===
                          "text and image"
                        }
                        onChange={() => optionTypeSet("text and image")}
                      />
                      <label htmlFor="T&I">Text & Image URL</label>
                    </div>
                  </div>
                  <div className="option-group">
                    {quiz.questions[questionId - 1]?.optionType === "text" ? (
                      <div className="options">
                        {quiz.questions[questionId - 1]?.options.map(
                          (option, index) => (
                            <div key={index} className="optionItem">
                              {quiz?.quizType === "Q & A" && (
                                <div
                                  className={`checkBox ${
                                    quiz?.questions[questionId - 1]?.answer ===
                                    index
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => correctAnswer(index)}
                                >
                                  <span></span>
                                </div>
                              )}
                              <input
                                type="text"
                                value={option.text || ""}
                                placeholder="Text"
                                onChange={(e) =>
                                  handleOptionChange(index, e, "text")
                                }
                              />
                              <img
                                src={DeleteIcon}
                                alt="delete option"
                                className="deleteOption"
                                onClick={() => deleteOption(index)}
                              />
                            </div>
                          )
                        )}
                        {quiz.questions[questionId - 1]?.options.length < 4 &&
                          quiz.questions[questionId - 1]?.optionType && (
                            <div className="addBtn" onClick={addOption}>
                              Add Option
                            </div>
                          )}
                      </div>
                    ) : quiz.questions[questionId - 1]?.optionType ===
                      "image" ? (
                      <div className="options">
                        {quiz.questions[questionId - 1]?.options.map(
                          (option, index) => (
                            <div key={index} className="optionItem">
                              <div
                                className={`checkBox ${
                                  quiz?.questions[questionId - 1]?.answer ===
                                  index
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => correctAnswer(index)}
                              >
                                <span></span>
                              </div>
                              <input
                                type="text"
                                value={option.image || ""}
                                placeholder="Image URL"
                                onChange={(e) =>
                                  handleOptionChange(index, e, "image")
                                }
                              />
                              <img
                                src={DeleteIcon}
                                alt="delete option"
                                className="deleteOption"
                                onClick={() => deleteOption(index)}
                              />
                            </div>
                          )
                        )}
                        {quiz.questions[questionId - 1]?.options.length < 4 &&
                          quiz.questions[questionId - 1]?.optionType && (
                            <div className="addBtn" onClick={addOption}>
                              Add Option
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="options">
                        {quiz.questions[questionId - 1]?.options.map(
                          (option, index) => (
                            <div key={index} className="optionItem">
                              <div
                                className={`checkBox ${
                                  quiz?.questions[questionId - 1]?.answer ===
                                  index
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => correctAnswer(index)}
                              >
                                <span></span>
                              </div>
                              <input
                                type="text"
                                value={option.text || ""}
                                placeholder="Text"
                                style={{ maxWidth: "255px" }}
                                onChange={(e) =>
                                  handleOptionChange(index, e, "text")
                                }
                              />
                              <input
                                type="text"
                                value={option.image || ""}
                                placeholder="Image URL"
                                style={{ maxWidth: "255px" }}
                                onChange={(e) =>
                                  handleOptionChange(index, e, "image")
                                }
                              />
                              <img
                                src={DeleteIcon}
                                alt="delete option"
                                className="deleteOption"
                                onClick={() => deleteOption(index)}
                              />
                            </div>
                          )
                        )}
                        {quiz.questions[questionId - 1]?.options.length < 4 &&
                          quiz.questions[questionId - 1]?.optionType && (
                            <div className="addBtn" onClick={addOption}>
                              Add Option
                            </div>
                          )}
                      </div>
                    )}
                    {quiz?.quizType === "Q & A" && (
                      <div className="timer">
                        <p>Timer</p>
                        <div className="timerBtns">
                          <input
                            type="button"
                            value={"OFF"}
                            className={`${
                              quiz?.questions[questionId - 1]?.timer
                                ? ""
                                : "selected"
                            }`}
                            onClick={() => updateTimer(null)}
                          />
                          <input
                            type="button"
                            value={"5 sec"}
                            className={`${
                              quiz?.questions[questionId - 1]?.timer === 5
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => updateTimer(5)}
                          />
                          <input
                            type="button"
                            value={"10 sec"}
                            className={`${
                              quiz?.questions[questionId - 1]?.timer === 10
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => updateTimer(10)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="actionBtns">
                <button onClick={stepBack}>Back</button>
                <button onClick={createQuiz}>Create Quiz</button>
              </div>
            </div>
          )}
          {step == 3 && (
            <div className="createQuizWrapper">
              <div className="sharePage" ref={QuizRef}>
                <img
                  src={Cross}
                  alt="close button"
                  onClick={func}
                  className="closeBtn"
                />
                <h2>Congrats your Quiz is Published!</h2>
                <p>{publishLink}</p>
                <button onClick={copyLink}>Share</button>
              </div>
              {isPopupOpen && (
                <Notification
                  text="Link Copied to Clipboard"
                  func={() => setIsPopupOpen(false)}
                />
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

CreateQuiz.propTypes = {
  func: PropTypes.func.isRequired,
};

export default CreateQuiz;
