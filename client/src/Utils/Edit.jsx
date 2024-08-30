import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Updater from "../components/Updater";

const Edit = () => {
  const [isEdit, setIsEdit] = useState(true);
  const { state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    isEdit === false && navigate("/admin/analytics");
  }, [isEdit]);
  return (
    <section className="edit">
      {isEdit && (
        <Updater data={state} func={() => setIsEdit(false)} />
      )}
    </section>
  );
};

export default Edit;
