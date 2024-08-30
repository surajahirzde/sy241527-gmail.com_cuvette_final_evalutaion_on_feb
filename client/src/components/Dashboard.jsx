import InfoButton from "../Utils/InfoButton";
import "./styles/Dashboard.css";
import eyeBtn from "../assets/icon-park-outline_eyes.svg";
import { useEffect, useState } from "react";
import {
  checkLogin,
  formatDateToCustom,
  getCookie,
} from "../helper/mainFunction";
import Loader from "../helper/Loader";
const Dashboard = () => {
  const [loader, setLoader] = useState(false);
  const [Quizs, setQuizs] = useState([]);
  async function fetchQuiz() {
    setLoader(true);
    await fetch(`${import.meta.env.VITE_API_URL}/api/quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setQuizs(data.data);
        }
      });
    setLoader(false);
  }
  useEffect(() => {
    checkLogin();
    fetchQuiz();
  }, []);
  return (
    <section className="dashboard">
      {loader ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="dashboard-header">
            <InfoButton
              color={"#FF5D01"}
              text={"Quiz"}
              anotherText={"Created"}
              number={Quizs.length}
            />
            <InfoButton
              color={"#60B84B"}
              text={"questions"}
              anotherText={"Created"}
              number={Quizs.map((item) => item.questions.length).reduce(
                (a, b) => a + b,
                0
              )}
            />
            <InfoButton
              color={"#5076FF"}
              text={"Total"}
              anotherText={"Impressions"}
              number={Quizs.map((item) => item.impressions).reduce(
                (a, b) => a + b,
                0
              )}
            />
          </div>
          <div className="quizContainer">
            <h2>Trending Quizs</h2>
            <div className="quizs">
              {Quizs.length > 0 ? (
                Quizs.map((quiz) => {
                  return (
                    <div className="quiz" key={quiz._id}>
                      <div className="info">
                        <h3>{quiz.quizName}</h3>
                        <div className="views">
                          <p>{quiz.impressions}</p>
                          <img src={eyeBtn} alt="eye" />
                        </div>
                      </div>
                      <p>{formatDateToCustom(quiz.createdAt)}</p>
                    </div>
                  );
                })
              ) : (
                <p> Data not found!</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
