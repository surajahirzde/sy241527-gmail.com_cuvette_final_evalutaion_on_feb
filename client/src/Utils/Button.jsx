import "./styles/button.css";
import PropTypes from "prop-types";
const Button = ({ text, activeClass, btnType, func, type }) => {
  return (
    <button
      className={`btn ${activeClass} ${btnType}`}
      type={type ? type : "button"}
      onClick={func}
    >
      {text}
    </button>
  );
};

export default Button;
Button.propTypes = {
  text: PropTypes.string,
  btnType: PropTypes.string,
  activeClass: PropTypes.string,
  type: PropTypes.string,
  func: PropTypes.func,
};
