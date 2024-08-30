import { useParams } from "react-router-dom";
import SideBar from "../Utils/SideBar";
import "./styles/Controller.css";
import Dashboard from "./Dashboard";
import Analytics from "./Analytics";
import QnAAnalysis from "../Utils/QnAAnalysis";
import Edit from "../Utils/Edit";
const Controller = () => {
  const { section } = useParams();
  return (
    <main className="controller">
      <div className="container">
        <SideBar />
        <div className="controller-item">
          {section === "dashboard" ? (
            <Dashboard />
          ) : section === "analytics" ? (
            <Analytics />
          ) : section === "edit" ? (
            <Edit />
          ) : (
            <QnAAnalysis />
          )}
        </div>
      </div>
    </main>
  );
};

export default Controller;
