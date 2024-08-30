import editBtn from "../assets/uil_edit.svg";
import deleteBtn from "../assets/vector.svg";
import share from "../assets/material-symbols_share.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "../Utils/Notification";
import "./styles/Analytics.css";
import DeletePopup from "../Utils/DeletePopup";
import {
  checkLogin,
  formatDateToCustom,
  getCookie,
} from "../helper/mainFunction";
import Loader from "../helper/Loader";

const Analytics = () => {
  const [isNotified, setIsNotified] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // for showing delete popup
  const [data, setData] = useState([]);
  const generateLink = (id, title) => {
    const serverUrl = window.location.origin;
    const link = `${serverUrl}/quiz/${id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsNotified(true);
        setNotificationMsg("Link copied to clipboard");
        setTimeout(() => {
          setIsNotified(false);
        }, 5000);
      })
      .catch((err) => console.log(err));
    navigator.share({
      title: "Share Link",
      text: title,
      url: link,
    });
  };
  const fetchQuiz = async () => {
    setIsLoading(true);
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
          setData(data.data);
        }
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };
  useEffect(() => {
    checkLogin();
    fetchQuiz();
  }, []);
  const handleDelete = async (action, id) => {
    setIsLoading(true);
    if (action === "delete") {
      await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          data.code === 200 && (fetchQuiz(), setIsDeleting(false));
        });
    }
    if (action === "cancel") {
      setIsDeleting(false);
    }
    setIsLoading(false);
  };
  return (
    <main className="analytics">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1>Quiz Analysis</h1>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created On</th>
                  <th>Impressions</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.quizName}</td>
                    <td>{formatDateToCustom(item.createdAt)}</td>
                    <td>{item.impressions}</td>
                    <td>
                      <Link to="edit" state={item} className="edit">
                        <img src={editBtn} alt="edit" />
                      </Link>
                      <button
                        className="delete"
                        onClick={() => {
                          setIsDeleting(true);
                          setDeleteId(item._id);
                        }}
                      >
                        <img src={deleteBtn} alt="delete" />
                      </button>
                      <button
                        className="share"
                        onClick={() => generateLink(item._id, item.quizName)}
                      >
                        <img src={share} alt="share" />
                      </button>
                    </td>
                    <td>
                      <Link to={`analytics/${item._id}`}>
                        Question Wise Analysis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {isNotified && (
        <Notification
          text={notificationMsg}
          func={() => setIsNotified(false)}
        />
      )}
      {isDeleting && <DeletePopup id={deleteId} func={handleDelete} />}
    </main>
  );
};

export default Analytics;
