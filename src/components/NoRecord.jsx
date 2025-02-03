import React from "react";
import { HiOutlineClipboardList } from "react-icons/hi";

const NoRecord = ({ message, addon }) => {
  return (
    <div className="no-record-container">
      <div className="no-record-yet">
        <HiOutlineClipboardList
          className="no-record-icon"
          style={{ transform: "scale(1.2)" }}
        />
        <p>{message ? message : "No records yet"}</p>
        {addon && addon}
      </div>
    </div>
  );
};

export default NoRecord;
