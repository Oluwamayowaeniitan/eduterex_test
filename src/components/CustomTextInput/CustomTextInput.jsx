import React from "react";
import "./CustomTextInput.css";

const CustomTextInput = ({
  name,
  icon,
  handleChange,
  value,
  placeholder,
  disabled,
}) => {
  return (
    <div className="custom-input-form-container">
      <input
        id={name}
        type={
          name.includes("date")
            ? "date"
            : name.includes("amount")
              ? "number"
              : name.includes("password")
                ? "password"
                : "text"
        }
        name={name}
        value={value}
        onChange={(e) => handleChange(e)}
        placeholder={placeholder}
        disabled={!!disabled}
      />
      {/* <div className="form-icons">{icon}</div> */}
    </div>
  );
};

export default CustomTextInput;
