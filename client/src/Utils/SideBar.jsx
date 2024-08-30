import { NavLink } from "react-router-dom";
import Button from "./Button";
import "./styles/SideBar.css";
import { useCallback, useState } from "react";
import CreateQuiz from "../components/CreateQuiz";
import { deleteCookie } from "../helper/mainFunction";

const SideBar = () => {
  const [openCreatePopUp, setOpenCreatePopUp] = useState(false);
  const logout = () => {
    // clear cookie
    deleteCookie("token");
    window.location.reload();
  };
  const heavyTask = useCallback(
    <CreateQuiz func={() => setOpenCreatePopUp(false)} />,
    []
  );
  return (
    <aside>
      <h2>QUIZZIE</h2>
      <div className="navigateLinks">
        <ul>
          <li>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/admin/analytics">Analytics</NavLink>
          </li>
          <li>
            <button onClick={() => setOpenCreatePopUp(true)}>
              Create Quiz
            </button>
          </li>
        </ul>
      </div>
      {openCreatePopUp && heavyTask}
      <div className="logoutBtn">
        <Button type="button" text="Logout" func={logout} />
      </div>
    </aside>
  );
};

export default SideBar;
