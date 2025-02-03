import React, { useEffect, useState } from "react";
import "../AddStaffModal/AddStaffModal.css";
import "./AssignClassRoleModal.css";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import { AlertBadge } from "../../AlertBadge";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";

const AssignClassRoleModal = ({
  isVisible,
  onClose,
  handleUpdateStaff,
  isLoading,
  classList,
  staff,
  classes,
}) => {
  const [formData, setFormData] = useState({
    selectedClasses: [],
    selectedRole: "",
    selectedStatus: false,
    staffId: "",
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (isVisible) {
      setFormData({
        selectedClasses: classes,
        selectedRole: staff?.role,
        selectedStatus: false,
        staffId: staff.id,
      });
    }
  }, [isVisible]);

  const handleClassSelection = (className) => {
    setFormData((prev) => {
      const isSelected = prev.selectedClasses.includes(className);
      const updatedClasses = isSelected
        ? prev.selectedClasses.filter((cls) => cls !== className)
        : [...prev.selectedClasses, className];
      return { ...prev, selectedClasses: updatedClasses };
    });
  };

  const handleRoleSelection = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, selectedRole: value });
  };

  const handleSubmit = () => {
    if (formData.selectedClasses.length === 0) {
      setMessage("Please select at least one class.");
      return;
    }
    if (!formData.selectedRole) {
      alert("Please select a role.");
      return;
    }

    handleUpdateStaff(formData, setMessage);
  };

  if (!isVisible) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Action</h2>
          <p>Select an action to carry out on {staff.full_name}</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />

        <div className="selection-section">
          <h2>Classes</h2>
          <div className="checkbox-group">
            {classList.map((className, index) => (
              <p key={index} className="checkbox-item">
                <input
                  type="checkbox"
                  value={className}
                  checked={formData.selectedClasses.includes(className)}
                  onChange={() => handleClassSelection(className)}
                />
                {className}
              </p>
            ))}
          </div>
        </div>

        <div className="selection-section">
          <h2>Role</h2>
          <div className="radio-group">
            {["Admin", "Principal", "Teacher"].map((role, index) => (
              <p key={index} className="radio-item">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={formData.selectedRole === role}
                  onChange={handleRoleSelection}
                />
                {role}
              </p>
            ))}
          </div>
        </div>
        <div className="selection-section">
          <h2>Status</h2>
          <p>
            Current Status:{" "}
            {staff?.is_active ? (
              <span
                style={{ fontSize: "12px", marginLeft: "5px" }}
                className="tuition-cleared"
              >
                Active
              </span>
            ) : (
              <span
                style={{ fontSize: "12px", marginLeft: "5px" }}
                className="tuition-not-cleared"
              >
                Suspended
              </span>
            )}
          </p>
          <div className="radio-group">
            <p className="radio-item">
              <input
                type="checkbox"
                checked={formData.selectedStatus}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedStatus: !prev.selectedStatus,
                  }))
                }
              />
              {staff?.is_active ? "Suspend" : "Reinstate"}
            </p>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomSmallButton
            text={isLoading ? <Loading /> : "Submit"}
            runFunction={handleSubmit}
            icon={<PiCheckCircleBold className="use-font-style" />}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignClassRoleModal;
