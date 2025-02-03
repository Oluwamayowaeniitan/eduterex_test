import React, { useState, useEffect } from "react";
import "../AddStaffModal/AddStaffModal.css"; // Import CSS styles
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiFillCalendar, AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import Loading from "../../../utils/Loader";

const EditStaffModal = ({
  isVisible,
  onClose,
  staffObject,
  updateData,
  loading,
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    profile_image: null,
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (isVisible === true) {
      setFormData({
        profile_image: staffObject?.passport
          ? `http://127.0.0.1:8000${staffObject?.passport}`
          : null,
        full_name: staffObject?.full_name || null,
        email: staffObject?.email_address || null,
        phone_number: staffObject?.phone_number || null,
        gender: staffObject?.gender || null,
        date_of_birth: staffObject?.date_of_birth || null,
      });
      setProfileImage(
        staffObject?.passport
          ? `http://127.0.0.1:8000${staffObject?.passport}`
          : null,
      );
      console.log("stffffffffffffffffffff", staffObject);
    }
  }, [isVisible, staffObject]);

  useEffect(() => {
    if (!isVisible) return;

    const fileInput = document.getElementById("fileInput");

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result); // Set the uploaded image
          setFormData({
            ...formData,
            profile_image: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, [isVisible, formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setAlert(false);
    if (isFormValid(formData, setMessage)) {
      updateData(formData);
    } else {
      setAlert(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Edit Profile</h2>
          <p>Please fill in the below details.</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="teacher-profile">
          <div className="image-upload">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
            />
            <label htmlFor="fileInput" id="imageBox">
              <span className={profileImage ? "hid-image" : "show-image"}>
                Click to upload image
              </span>
              {profileImage && (
                <img
                  className="show-image"
                  id="uploadedImage"
                  src={profileImage}
                  alt="Uploaded"
                />
              )}
            </label>
          </div>
          <CustomTextInput
            name={"full_name"}
            placeholder={"Full Name"}
            value={formData.full_name}
            handleChange={handleChange}
            icon={<FiUser className="icons" />}
          />
          <CustomTextInput
            name={"email"}
            placeholder={"Email Address"}
            value={formData.email}
            handleChange={handleChange}
            icon={<FiMail className="icons" />}
          />
          <CustomTextInput
            placeholder={"Phone Number"}
            name={"phone_number"}
            value={formData.phone_number}
            handleChange={handleChange}
            icon={<FiPhone className="icons" />}
          />
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Date of Birth</label>
            <CustomTextInput
              placeholder={"Date of Birth"}
              name={"date_of_birth"}
              value={formData.date_of_birth}
              handleChange={handleChange}
              icon={<AiFillCalendar className="icons" />}
            />
          </div>
          <CustomSelectionInput
            placeholder={"Gender"}
            name={"gender"}
            value={formData.gender}
            handleChange={handleChange}
            data={["Male", "Female"]}
            icon={<FiUserPlus className="icons" />}
          />
        </div>
        {alert && <AlertBadge message={message} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomSmallButton
            runFunction={handleAdd}
            text={loading ? <Loading /> : "Update profile"}
            icon={<AiOutlineUsergroupAdd style={{ fontSize: "20px" }} />}
          />
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
