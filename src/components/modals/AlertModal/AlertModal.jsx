import React, { useState, useEffect } from "react";
import "./AlertModal.css";
import { MdClose } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { IoCloseCircle } from "react-icons/io5";
import { PiCheckCircleBold } from "react-icons/pi";

const AlertModal = ({ isVisible, onClose, message, success }) => {
  if (!isVisible) return null;
  return (
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-container">
          {success ? (
            <BiCheckCircle className="alert-icon-success" />
          ) : (
            <IoCloseCircle className="alert-icon-fail" />
          )}
          <p>{message}</p>
          <CustomSmallButton
            icon={<PiCheckCircleBold className="use-font-style" />}
            text={"Okay"}
            runFunction={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
