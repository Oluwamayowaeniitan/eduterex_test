import { FiAlertCircle } from "react-icons/fi";

export const AlertBadge = ({ message, success }) => {
  return (
    <div
      className="alert-message"
      style={{ color: success ? "#4caf50" : "#f44336" }}
    >
      <FiAlertCircle className="alert-icon" />
      <p>{message ? message : "Please fill in all fields"}</p>
    </div>
  );
};
