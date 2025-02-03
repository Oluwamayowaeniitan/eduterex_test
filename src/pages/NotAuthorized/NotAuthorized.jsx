import React from "react";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { useNavigate } from "react-router-dom";
import "./NotAuthorized.css";

const NotAuthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="not-authorized-container">
      <h2>You are not authorized to view this page</h2>
      <CustomSmallButton
        text={"Go back to Dashboard!"}
        runFunction={() => navigate("/dashboard", { replace: true })}
      />
    </div>
  );
};

export default NotAuthorized;
