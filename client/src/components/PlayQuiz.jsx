import { useState } from "react";
import Button from "../Utils/Button";
import "./styles/PlayQuiz.css";
import Game from "./Game";
import ResultPage from "../Utils/ResultPage";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../helper/Loader";

const PlayQuiz = () => {
  const { quizId } = useParams();
  const [isStarted, setIsStarted] = useState("none");
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const addImpressionApi = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/quiz/${quizId}/impressions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          fetch(`${import.meta.env.VITE_API_URL}/api/quiz/${quizId}`)
            .then((res) => res.json())
            .then((data) => {
              data.code === 200 && setQuiz(data.data);
            });
        }
        if (data.code === 404) {
          navigate("/404", { state: { message: "Quiz Not Found" } });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <main className="play-quiz">
      {isStarted === "none" ? (
        <Button
          type={"button"}
          text={"Play Quiz"}
          func={() => {
            setIsStarted("yes");
            addImpressionApi();
          }}
        />
      ) : isStarted === "yes" && quiz ? (
        <Game
          quiz={quiz}
          setScore={setScore}
          func={() => setIsStarted("ended")}
        />
      ) : isStarted === "ended" ? (
        <ResultPage
          type={`${quiz?.quizType === "Poll Type" ? "Poll Type" : "Q & A"}`}
          score={`${score > 9 ? score : `0${score}`}/0${
            quiz?.questions?.length
          }`}
        />
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default PlayQuiz;
