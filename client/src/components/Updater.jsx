import { useEffect, useRef, useState } from "react";
import "./styles/CreateQuiz.css";
import PlusBtn from "../assets/add.svg";
import Cross from "../assets/charm_cross.svg";
import DeleteIcon from "../assets/vector.svg";
import PropTypes from "prop-types";
import Notification from "../Utils/Notification";
import { checkLogin, getCookie } from "../helper/mainFunction";

const Updater = ({ func, data }) => {
  const [quiz, setQuiz] = useState(
    data || {
      quizName: "",
      quizType: "",
      questions: [],
    }
  );
  const [publishLink, setPublishLink] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [questionId, setQuestionId] = useState(null);
  const [updateIndex, setUpdateIndex] = useState(0);
  const QuizRef = useRef(null);

  useEffect(() => {
    checkLogin();
    setQuestionId(quiz?.questions[updateIndex]?._id);
  }, []);

  useEffect(() => {
    setQuestionId(quiz?.questions[updateIndex]?._id);
  }, [updateIndex]);

  const hidePopup = (event) => {
    if (QuizRef.current && !QuizRef.current.contains(event.target)) {
      func();
    }
  };

  const handleOptionChange = (index, e, field) => {
    const newOptionValue = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question._id === questionId
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
        question._id === questionId
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

  const validateCurrentQuestion = (currentQuestion) => {
    if (!currentQuestion.question) {
      alert("Please fill in the question text.");
      return false;
    }

    if (!currentQuestion.optionType) {
      alert("Please select an option type.");
      return false;
    }

    if (currentQuestion.options.length < 2) {
      alert("Please provide at least two options.");
      return false;
    }

    if (currentQuestion.options.some((opt) => !opt.text && !opt.image)) {
      alert("Please fill all option fields.");
      return false;
    }

    if (quiz.quizType === "Q & A" && currentQuestion.answer === undefined) {
      alert("Please select a correct answer.");
      return false;
    }

    return true;
  };

  const validateQuizBeforeCreation = () => {
    if (!quiz.quizName) {
      alert("Please enter a quiz name.");
      return false;
    }

    if (!quiz.quizType) {
      alert("Please select a quiz type.");
      return false;
    }

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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quiz/${quiz?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("token"),
          },
          body: JSON.stringify(quizData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const result = await response.json();
      setPublishLink(`${import.meta.env.VITE_MY_URL}/quiz/${result.quizId}`);
      setStep(3);
    } catch (error) {
      console.error("Failed to send quiz data:", error);
      alert("Failed to create quiz. Please try again.");
    }
  };

  const stepBack = () => {
    setStep(1);
    setUpdateIndex(0); // Reset to the first question
  };

  const handleQuestionChange = (e) => {
    const newQuestionText = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question) =>
        question._id === questionId
          ? {
              ...question,
              question: newQuestionText,
            }
          : question
      ),
    }));
  };

  const updateQuiz = () => {
    if (validateQuizBeforeCreation()) {
      sendQuizToApi(quiz);
    }
  };

  const notAllow = () => {
    alert("Action is not allowed");
  };

  return (
    <section className="create-quiz" onClick={hidePopup}>
      {step === 1 && (
        <div className="createQuizWrapper" ref={QuizRef}>
          <input
            type="text"
            placeholder="Quiz name"
            value={quiz?.quizName}
            readOnly
          />
          <div className="quizType">
            <label htmlFor="quizType">Quiz Type</label>
            <input
              className={quiz.quizType === "Q & A" ? "selected" : ""}
              type="button"
              value="Q & A"
              onClick={notAllow}
            />
            <input
              className={quiz.quizType === "Poll Type" ? "selected" : ""}
              type="button"
              value="Poll Type"
              onClick={notAllow}
            />
          </div>
          <div className="actionBtns">
            <button onClick={func}>Cancel</button>
            <button onClick={() => setStep(2)}>Continue</button>
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
                    onClick={() => setUpdateIndex(index)}
                  >
                    <span>{index + 1}</span>
                    {questionId === quiz.questions[index]._id && (
                      <div className="delete" onClick={notAllow}>
                        <img src={Cross} alt="delete question" />
                      </div>
                    )}
                  </div>
                ))}
                {quiz.questions.length < 5 && (
                  <div className="addBtn" onClick={notAllow}>
                    <img src={PlusBtn} alt="add question" />
                  </div>
                )}
              </div>
              <p>Max 5 questions</p>
            </div>
            <div className="questionContainer">
              <input
                type="text"
                placeholder={quiz.quizType === "Q & A" ? "Question" : "Poll"}
                onChange={handleQuestionChange}
                value={quiz?.questions[updateIndex]?.question || ""}
              />
              <div className="optionType">
                <label htmlFor="optionType">Option Type</label>
                <div className="typeGroup">
                  <input
                    type="radio"
                    name="optionType"
                    id="text"
                    checked={quiz.questions[updateIndex]?.optionType === "text"}
                    onChange={notAllow}
                  />
                  <label htmlFor="text">Text</label>
                </div>
                <div className="typeGroup">
                  <input
                    type="radio"
                    name="optionType"
                    id="image"
                    checked={
                      quiz.questions[updateIndex]?.optionType === "image"
                    }
                    onChange={notAllow}
                  />
                  <label htmlFor="image">Image URL</label>
                </div>
                <div className="typeGroup">
                  <input
                    type="radio"
                    name="optionType"
                    id="T&I"
                    checked={
                      quiz.questions[updateIndex]?.optionType ===
                      "text and image"
                    }
                    onChange={notAllow}
                  />
                  <label htmlFor="T&I">Text & Image URL</label>
                </div>
              </div>
              <div className="option-group">
                {quiz.questions[updateIndex]?.optionType === "text" ? (
                  <div className="options">
                    {quiz.questions[updateIndex]?.options.map(
                      (option, index) => (
                        <div key={index} className="optionItem">
                          {quiz?.quizType === "Q & A" && (
                            <div
                              className={`checkBox ${
                                quiz?.questions[updateIndex]?.answer === index
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={notAllow}
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
                            onClick={notAllow}
                          />
                        </div>
                      )
                    )}
                    {quiz.questions[updateIndex]?.options.length < 4 &&
                      quiz.questions[updateIndex]?.optionType && (
                        <div className="addBtn" onClick={notAllow}>
                          Add Option
                        </div>
                      )}
                  </div>
                ) : quiz.questions[updateIndex]?.optionType === "image" ? (
                  <div className="options">
                    {quiz.questions[updateIndex]?.options.map(
                      (option, index) => (
                        <div key={index} className="optionItem">
                          <div
                            className={`checkBox ${
                              quiz?.questions[updateIndex]?.answer === index
                                ? "selected"
                                : ""
                            }`}
                            onClick={notAllow}
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
                            onClick={notAllow}
                          />
                        </div>
                      )
                    )}
                    {quiz.questions[updateIndex]?.options.length < 4 &&
                      quiz.questions[updateIndex]?.optionType && (
                        <div className="addBtn" onClick={notAllow}>
                          Add Option
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="options">
                    {quiz.questions[updateIndex]?.options.map(
                      (option, index) => (
                        <div key={index} className="optionItem">
                          <div
                            className={`checkBox ${
                              quiz?.questions[updateIndex]?.answer === index
                                ? "selected"
                                : ""
                            }`}
                            onClick={notAllow}
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
                            onClick={notAllow}
                          />
                        </div>
                      )
                    )}
                    {quiz.questions[updateIndex]?.options.length < 4 &&
                      quiz.questions[updateIndex]?.optionType && (
                        <div className="addBtn" onClick={notAllow}>
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
                          quiz?.questions[updateIndex]?.timer ? "" : "selected"
                        }`}
                        onClick={() => updateTimer(null)}
                      />
                      <input
                        type="button"
                        value={"5 sec"}
                        className={`${
                          quiz?.questions[updateIndex]?.timer === 5
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => updateTimer(5)}
                      />
                      <input
                        type="button"
                        value={"10 sec"}
                        className={`${
                          quiz?.questions[updateIndex]?.timer === 10
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => updateTimer(10)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="actionBtns">
                <button onClick={stepBack}>Back</button>
                <button onClick={updateQuiz}>Update Quiz</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
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
      {isPopupOpen && (
        <Notification
          text="Link copied to clipboard!"
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </section>
  );
};

Updater.propTypes = {
  func: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default Updater;
