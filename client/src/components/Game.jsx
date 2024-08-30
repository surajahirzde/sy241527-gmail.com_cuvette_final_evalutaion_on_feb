import { useEffect, useLayoutEffect, useState } from "react";
import "./styles/Game.css";
import PropTypes from "prop-types";
import Loader from "../helper/Loader";
const Game = ({ func, quiz, setScore }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolled, setIsPolled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // State to track the selected option
  useEffect(() => {
    addAttempQuestionApi();
  }, []);
  useEffect(() => {
    if (quiz?.questions[currentQuestion]?.timer) {
      setTimer(quiz?.questions[currentQuestion]?.timer);
    } else {
      setTimer(null);
    }
    setSelectedOption(null); // Reset selected option when question changes
  }, [currentQuestion, quiz?.questions]);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0 && quiz?.questions[currentQuestion]?.timer) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          quiz?.quizType !== "Poll Type" && handleNextQuestion();
          return 0;
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleNextQuestion = async () => {
    if (currentQuestion < quiz?.questions?.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      func("ended");
    }
    await addAttempQuestionApi();
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (quiz.quizType === "Poll Type") {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/quiz/${
          quiz?._id
        }/questions/${currentQuestion}/poll-options/${index}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            setIsPolled(true);
          }
        })
        .catch((err) => console.log(err));
    }
    if (quiz.quizType === "Q & A") {
      if (
        quiz?.questions[currentQuestion]?.answer === index &&
        selectedOption === null
      ) {
        setScore((prevScore) => prevScore + 1);
        // Call API to add correct answer
        fetch(
          `${import.meta.env.VITE_API_URL}/api/quiz/${
            quiz?._id
          }/correct-answers/${currentQuestion} `,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        // Call API to add wrong answer
        fetch(
          `${import.meta.env.VITE_API_URL}/api/quiz/${
            quiz?._id
          }/wrong-answers/${currentQuestion} `,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };
  const addAttempQuestionApi = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/quiz/${
        quiz?._id
      }/attempted-questions/${currentQuestion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="game">
      <div className="game-header">
        <p>
          <span className="qno">{`0${currentQuestion + 1} / 0${
            quiz?.questions?.length
          }`}</span>
          <span className="timer">
            {quiz?.quizType !== "Poll Type" && timer !== null
              ? `00:${timer > 9 ? timer : `0${timer}`}s`
              : null}
          </span>
        </p>
      </div>
      <div className="game-body">
        <h2>{quiz?.questions[currentQuestion]?.question}</h2>
        <div className="options">
          {quiz?.questions[currentQuestion]?.optionType === "text"
            ? quiz?.questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${
                    index === quiz?.questions[currentQuestion]?.answer
                      ? "correct"
                      : ""
                  } ${index === selectedOption ? "selected" : ""}`} // Add 'selected' class if this option is selected
                  onClick={() => {
                    !isPolled && handleOptionClick(index);
                  }}
                >
                  {option.text}
                </div>
              ))
            : quiz?.questions[currentQuestion]?.optionType === "image"
            ? quiz?.questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  style={{ backgroundImage: `url(${option.image})` }}
                  className={`option image-option ${
                    index === quiz?.questions[currentQuestion]?.answer
                      ? "correct"
                      : ""
                  } ${index === selectedOption ? "selected" : ""}`} // Add 'selected' class if this option is selected
                  onClick={() => {
                    !isPolled && handleOptionClick(index);
                  }}
                ></div>
              ))
            : quiz?.questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`option text image-option ${
                    index === selectedOption ? "selected" : ""
                  }`} // Add 'selected' class if this option is selected
                  onClick={() => {
                    !isPolled && handleOptionClick(index);
                  }}
                >
                  <p>{option.text}</p>
                  <img src={option.image} alt="option" />
                </div>
              ))}
        </div>

        <div className="game-footer">
          <button className="next-btn" onClick={handleNextQuestion}>
            {currentQuestion < quiz?.questions?.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
      {isLoading && <Loader />}
    </section>
  );
};

export default Game;

Game.propTypes = {
  quiz: PropTypes.object.isRequired,
  setScore: PropTypes.func.isRequired,
  func: PropTypes.func.isRequired,
};
