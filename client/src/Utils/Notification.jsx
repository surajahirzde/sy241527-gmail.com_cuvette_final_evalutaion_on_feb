import correctIcon from "../assets/icon.svg";
import CrossIcon from "../assets/charm_cross.svg";
import PropTypes from "prop-types";
import "./styles/Notification.css";
const Notification = ({ text, func }) => {
  return (
    <div className="notification">
      <div className="notification-info">
        <img src={correctIcon} alt="correct icon" />
        <p>{text}</p>
        <img src={CrossIcon} alt="cross icon" onClick={func} className="close" />
      </div>
    </div>
  );
};

export default Notification;

Notification.propTypes = {
  text: PropTypes.string,
  func: PropTypes.func,
};
