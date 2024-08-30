import PropTypes from "prop-types";
import "./styles/DeletePopup.css";
const DeletePopup = ({ func, id }) => {
  return (
    <div className="delete-popup">
      <div className="popWrapper">
        <h2>Are you confirm you want to delete ?</h2>
        <div className="btn-group">
          <button onClick={() => func("delete", id)}>Confirm Delete</button>
          <button onClick={() => func("cancel")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;

DeletePopup.propTypes = {
  func: PropTypes.func,
  id: PropTypes.string,
};
