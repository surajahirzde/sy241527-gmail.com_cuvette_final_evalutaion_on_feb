import award from "../assets/award.svg";
import PropTypes from "prop-types";
import "./styles/ResultPage.css";
const ResultPage = ({ type, score }) => {
  return (
    <section className="result">
      {type === "Q & A" ? (
        <div className="result-wrapper">
          <h1>Congrats Quiz is completed</h1>
          <img src={award} alt="award" />
          <h1>
            Your score is <span>{score}</span>
          </h1>
        </div>
      ) : (
        <div className="result-wrapper">
          <h1 className="poll">Thank you for participating in the Poll</h1>
        </div>
      )}
    </section>
  );
};

export default ResultPage;

ResultPage.propTypes = {
  type: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
};
