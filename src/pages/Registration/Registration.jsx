import React, { useState } from "react";
import "./Registration.css";
import AddStaffModal from "../../components/modals/AddStaffModal/AddStaffModal";
import AddStudentModal from "../../components/modals/AddStudentModal/AddStudentModal";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";
import ListItem from "../../components/ListItem/ListItem";
import { HiOutlineClipboardList } from "react-icons/hi";
import { doesObjectExist } from "../../utils/OnboardingUtils/ObjectChecker";
import { sub } from "framer-motion/client";
import Loading from "../../utils/Loader";
import { AlertBadge } from "../../components/AlertBadge";
import { registerStaff, registerStudent } from "../../services/schoolService";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { FaGraduationCap, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";

const Registration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [staffObject, setStaffObject] = useState({});

  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const handleOpenStudentModal = () => setIsStudentModalVisible(true);
  const handleCloseStudenteModal = () => setIsStudentModalVisible(false);
  const [studentObject, setStudentObject] = useState({});

  const { authState, logout } = useAuth();
  const { schoolState, setSchoolDatas } = useSchool();

  const { user } = authState;
  const { classes, schoolSession } = schoolState;

  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const handleAddStudent = (studentObject) => {
    studentList.push(studentObject);
  };

  const [staffEditIndex, setStaffEditIndex] = useState(null);
  const [studentEditIndex, setStudentEditIndex] = useState(null);

  const handleStaffEdit = (index) => {
    setStaffObject(staffList[index - 1]);
    setStaffEditIndex(index);
    setIsModalVisible(true);
  };

  const handleStudentEdit = (index) => {
    setStudentObject(studentList[index - 1]);
    setStudentEditIndex(index);
    setIsStudentModalVisible(true);
  };

  const handleStaffDelete = (index) => {
    const newStaffList = staffList.filter((obj, i) => i !== index - 1);
    setStaffList(newStaffList);
    setStaffEditIndex(null);
  };

  const handleStudentDelete = (index) => {
    const newStudentList = studentList.filter((obj, i) => i !== index - 1);
    setStudentList(newStudentList);
    setStudentEditIndex(null);
  };

  function getClassNames(data) {
    return data.map((item) => `${item.name} Teacher`);
  }

  function getClassNamesStudent(data) {
    return data.map((item) => item.name);
  }

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentMessage, setStudentMessage] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const handleUploadStaff = async () => {
    setLoading(true);
    try {
      const response = await registerStaff(
        JSON.stringify({ staff_list: staffList }),
      );

      setMessage(response.message);
      setLoading(false);

      if (response.success) {
        setStaffList(response.error);
        setSchoolDatas(response.schoolData);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
    }
  };

  const handleUploadStudent = async () => {
    setStudentLoading(true);
    try {
      const response = await registerStudent(
        JSON.stringify({ student_list: studentList }),
      );
      setStudentLoading(false);
      setStudentMessage(response.message);

      if (response.success) {
        setStudentList(response.error);
        setSchoolDatas(response.schoolData);
      } else {
        setStudentMessage(response.message);
      }
    } catch (error) {
      setStudentLoading(false);
      setStudentMessage(error);
    }
  };

  const newClassNames = ["Admin", "Principal", ...getClassNames(classes)];
  const [registrationType, setRegistrationType] = useState("student");

  return (
    <div className="registration-container" style={{ height: "100%" }}>
      <div className="registration-type">
        <CustomSmallButton
          text={
            registrationType === "student"
              ? "Register Staff Instead?"
              : "Register Student Instead?"
          }
          icon={
            registrationType === "staff" ? <FaUserGraduate /> : <FaUserTie />
          }
          runFunction={() =>
            setRegistrationType(
              registrationType === "student" ? "staff" : "student",
            )
          }
        />
      </div>
      {user?.permission_list?.includes("can_add_staff_and_student") ? (
        <div className="registration-page">
          <div
            className={`${registrationType === "student" ? "r-hide-view" : "r-show-view"} staff-registration `}
          >
            <div className="top-section">
              <CustomSmallButton
                text={"Add Staff"}
                runFunction={handleOpenModal}
                icon={<BiPlusCircle size={"18px"} />}
              />
            </div>
            {staffList.length > 0 ? (
              <div className="list-container">
                {staffList.map((obj, index) => (
                  <ListItem
                    object={obj}
                    index={index + 1}
                    handleEdit={handleStaffEdit}
                    handleDelete={handleStaffDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bottom-section">
                <div className="no-record-yet">
                  <HiOutlineClipboardList
                    className="no-record-icon"
                    style={{ transform: "scale(1.2)" }}
                  />
                  <p>No records yet</p>
                </div>
              </div>
            )}
            <div
              className="top-section"
              style={{ borderBottom: "none", borderTop: "1px solid #711a75" }}
            >
              {message && (
                <AlertBadge
                  success={staffList.length > 0 ? false : true}
                  message={message}
                />
              )}
              <CustomSmallButton
                text={loading ? <Loading /> : "Upload Data"}
                runFunction={handleUploadStaff}
                disabled={staffList.length < 1 || loading}
              />
            </div>
          </div>
          <div
            className={`${registrationType === "staff" ? "r-hide-view" : "r-show-view"} student-registration`}
          >
            <div className="top-section">
              <CustomSmallButton
                text={"Add Student"}
                runFunction={handleOpenStudentModal}
                icon={<BiPlusCircle size={"18px"} />}
              />
            </div>
            {studentList.length > 0 ? (
              <div className="list-container">
                {studentList.map((obj, index) => (
                  <ListItem
                    object={obj}
                    index={index + 1}
                    handleEdit={handleStudentEdit}
                    handleDelete={handleStudentDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bottom-section">
                <div className="no-record-yet">
                  <HiOutlineClipboardList
                    className="no-record-icon"
                    style={{ transform: "scale(1.2)" }}
                  />
                  <p>No records yet</p>
                </div>
              </div>
            )}
            <div
              className="top-section"
              style={{ borderBottom: "none", borderTop: "1px solid #711a75" }}
            >
              {studentMessage && (
                <AlertBadge
                  success={studentList.length > 0 ? false : true}
                  message={studentMessage}
                />
              )}
              <CustomSmallButton
                text={studentLoading ? <Loading /> : "Upload Data"}
                runFunction={handleUploadStudent}
                disabled={studentList.length < 1 || studentLoading}
              />
            </div>
          </div>
          <AddStaffModal
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            staffObject={staffObject}
            setStaffObject={setStaffObject}
            isEdit={staffEditIndex}
            setEditIndex={setStaffEditIndex}
            staffList={staffList}
            setStaffList={setStaffList}
            classList={newClassNames}
          />
          <AddStudentModal
            isVisible={isStudentModalVisible}
            onClose={handleCloseStudenteModal}
            studentObject={studentObject}
            setStudentObject={setStudentObject}
            isEdit={studentEditIndex}
            setEditIndex={setStudentEditIndex}
            studentList={studentList}
            setStudentList={setStudentList}
            classList={getClassNamesStudent(classes)}
            sessionList={schoolSession || []}
          />
        </div>
      ) : (
        <div className="no-permission">
          <p>You dont have permission to carry out this action</p>
        </div>
      )}
    </div>
  );
};

export default Registration;
