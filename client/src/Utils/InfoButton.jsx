import PropTypes from "prop-types";
import "./styles/InfoButton.css";

const InfoButton = ({ number, text, anotherText, color }) => {
  return (
    <div style={{ color: color }} className="info-button">
      <div className="info-button-text">
        <div className="group">
          <span>
            {number > 1000000
              ? `${(number / 1000000).toFixed(1)}m`
              : number > 1000
              ? `${(number / 1000).toFixed(1)}k`
              : number}
          </span>
          <span>&nbsp;{text}</span>
        </div>
        <span>{anotherText}</span>
      </div>
    </div>
  );
};

export default InfoButton;

InfoButton.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string,
  anotherText: PropTypes.string,
  color: PropTypes.string,
};
