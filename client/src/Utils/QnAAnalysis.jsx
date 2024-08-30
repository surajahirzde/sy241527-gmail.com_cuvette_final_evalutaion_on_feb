import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/QnAAnalysis.css";
import { checkLogin, formatDateToCustom } from "../helper/mainFunction";
const QnAAnalysis = () => {
  const { QId } = useParams();
  const [quizData, setQuizData] = useState(null);
  useEffect(() => {
    if (!QId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/quiz/${QId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizData(data.data);
      });
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    checkLogin();
    if (!QId) {
      navigate("/admin/dashboard");
    }
  }, []);
  return (
    <section className="QnAAnalysis">
      {quizData && (
        <>
          <div className="qnaHeader">
            <h1>{quizData.quizName} : Analysis</h1>
            <p>
              <span>Created on: {formatDateToCustom(quizData.createdAt)}</span>
              <span>Impressions: {quizData.impressions}</span>
            </p>
          </div>
          <div className="questionsContainer">
            {quizData?.quizType === "Q & A"
              ? quizData?.questions?.map((question, index) => (
                  <div className="questionBox" key={index}>
                    <div className="question">
                      Q.{index + 1} {question.question}
                    </div>

                    <div className="analysisContainer">
                      <div className="box">
                        <h3>{question.totalAttempted}</h3>
                        <p>people Attempted the question</p>
                      </div>
                      <div className="box">
                        <h3>{question.correctAnswers}</h3>
                        <p>people answered correctly</p>
                      </div>
                      <div className="box">
                        <h3>{question.wrongAnswers}</h3>
                        <p>people answered incorrectly</p>
                      </div>
                    </div>
                  </div>
                ))
              : quizData?.questions?.map((question, index) => (
                  <div className="questionBox" key={question._id}>
                    <div className="question">
                      Q.{index + 1} {question.question}
                    </div>
                    <div className="pollContainer">
                      {question.optionType === "text"
                        ? question?.options?.map((option, index) => (
                            <div className="box" key={index}>
                              <h3>
                                {question?.optionCounts[index]}
                              </h3>
                              <p>{option.text}</p>
                            </div>
                          ))
                        : question.optionType === "image"
                        ? question?.options?.map((option, index) => (
                            <div className="box" key={index}>
                              <h3>
                                {
                                  question?.optionCounts[index]
                                }
                              </h3>
                              <img src={option.image} alt="image" />
                            </div>
                          ))
                        : question.optionType === "text and image"
                        ? question?.options?.map((option, index) => (
                            <div className="box" key={index}>
                              <h3>
                                {question?.optionCounts[index]}
                              </h3>
                              <div className="imgOption">
                                <p>{option.text}</p>
                                <img src={option.image} alt="image" />
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                ))}
          </div>
        </>
      )}
    </section>
  );
};

export default QnAAnalysis;
