import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdLogout,
  MdNotificationsActive,
  MdOutlineEventAvailable,
  MdSchool,
  MdSubscriptions,
} from "react-icons/md";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";
import {
  FaHamburger,
  FaMoneyBillWave,
  FaRegClipboard,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { BiSpreadsheet } from "react-icons/bi";
import { AiOutlineBank } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { CgClose, CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";

const Home = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const { authState, logout } = useAuth();
  const { schoolState } = useSchool();

  const { user } = authState;
  const { classes } = schoolState;

  const [showDropdown, setShowDropdown] = useState({
    studentManagerDropdown: false,
    attendanceManagerDropdown: false,
    resultManagerDropdown: false,
  });

  function removeNumbers(input) {
    return input.replace(/[0-9]/g, "");
  }

  const navigate = useNavigate();

  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="home-page">
      <div
        className={`home-aside ${mobileNav ? "show-toggle" : "hidden-toggle"}`}
      >
        <div className="close-hamburger-container">
          <CgClose
            className="close-hamburger"
            onClick={() => setMobileNav(false)}
          />
        </div>
        <div className="logo">
          <img
            src={`http://127.0.0.1:8000${user?.school?.logo}`}
            alt=""
            srcset=""
          />
        </div>
        <div>
          <h4
            style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}
          >
            {user?.school?.name || "School Name"}
          </h4>
        </div>
        <div className="option-container overflow">
          <div>
            <div className="divider-line"></div>
          </div>
          <Link
            className={`action-container ${activeTab === "Dashboard" ? "btn-active" : "btn-inactive"}`}
            onClick={() => {
              setActiveTab("Dashboard");
              setMobileNav(false);
            }}
            to={"/dashboard"}
          >
            <MdDashboard />
            <p>Dashboard</p>
          </Link>
          <div>
            <div className="divider-line"></div>
          </div>
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Academic Session" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Academic Session");
                setMobileNav(false);
              }}
              to={"/academic-session"}
            >
              <MdSchool />
              <p>Academic Sessions</p>
            </Link>
          )}
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Registration" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Registration");
                setMobileNav(false);
              }}
              to={"/registration"}
            >
              <FaRegClipboard />
              <p>Registration</p>
            </Link>
          )}
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Staff Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Staff Manager");
                setMobileNav(false);
              }}
              to={"/staff-manager"}
            >
              <FaUserTie />
              <p>Staff Manager</p>
            </Link>
          )}
          <div className="list-dropdown">
            <div
              className="list-dropdown-keeper"
              onClick={() => {
                setShowDropdown((prev) => ({
                  studentManagerDropdown: !prev.studentManagerDropdown,
                }));
              }}
            >
              <FaUserGraduate />
              <p>Student Manager</p>
            </div>
            <div
              className={
                showDropdown.studentManagerDropdown
                  ? "dropdown-classes-show overflow"
                  : "dropdown-classes-hide"
              }
            >
              {classes.map((obj, index) => (
                <Link
                  key={index}
                  className={`action-container sub-dropdown ${activeTab === `Student Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                  onClick={() => {
                    setActiveTab(`Student Manager ${obj.id}`);
                    setMobileNav(false);
                  }}
                  to="/student-manager"
                  state={{ className: obj.name, classId: obj.id }}
                >
                  <p>{obj.name}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="list-dropdown">
            <div
              className="list-dropdown-keeper"
              onClick={() => {
                setShowDropdown((prev) => ({
                  attendanceManagerDropdown: !prev.attendanceManagerDropdown,
                }));
              }}
            >
              <MdOutlineEventAvailable />
              <p>Attendance Manager</p>
            </div>
            <div
              className={
                showDropdown.attendanceManagerDropdown
                  ? "dropdown-classes-show overflow"
                  : "dropdown-classes-hide"
              }
            >
              {classes.map((obj, index) => (
                <Link
                  key={index}
                  className={`action-container sub-dropdown ${activeTab === `Attendance Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                  onClick={() => {
                    setActiveTab(`Attendance Manager ${obj.id}`);
                    setMobileNav(false);
                  }}
                  to="/attendance-manager"
                  state={{ className: obj.name, classId: obj.id }}
                >
                  <p>{obj.name}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="list-dropdown">
            <div
              className="list-dropdown-keeper"
              onClick={() => {
                setShowDropdown((prev) => ({
                  resultManagerDropdown: !prev.resultManagerDropdown,
                }));
              }}
            >
              <BiSpreadsheet />
              <p>Result Manager</p>
            </div>
            <div
              className={
                showDropdown.resultManagerDropdown
                  ? "dropdown-classes-show overflow"
                  : "dropdown-classes-hide"
              }
            >
              <Link
                className={`action-container sub-dropdown ${activeTab === `Result Manager 11111111111119999999999999` ? "btn-active" : "btn-inactive"}`}
                onClick={() => {
                  setActiveTab(`Result Manager 11111111111119999999999999`);
                  setMobileNav(false);
                }}
                to="/view-result"
              >
                <p>View Result</p>
              </Link>
              {classes.map((obj, index) => (
                <Link
                  key={index}
                  className={`action-container sub-dropdown ${activeTab === `Result Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                  onClick={() => {
                    setActiveTab(`Result Manager ${obj.id}`);
                    setMobileNav(false);
                  }}
                  to="/result-manager"
                  state={{ className: obj.name, classId: obj.id }}
                >
                  <p>{obj.name}</p>
                </Link>
              ))}
            </div>
          </div>
          {user?.role !== "Teacher" && (
            <div>
              <div className="divider-line"></div>
            </div>
          )}
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Tuition Fee Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Tuition Fee Manager");
                setMobileNav(false);
              }}
              to={"/tuition-fee-manager"}
            >
              <FaMoneyBillWave />
              <p>Tuition Fee Manager</p>
            </Link>
          )}
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "School Account Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("School Account Manager");
                setMobileNav(false);
              }}
              to={"/account-manager"}
            >
              <AiOutlineBank />
              <p>School Account Manager</p>
            </Link>
          )}
          <div>
            <div className="divider-line"></div>
          </div>
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Settings" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Settings");
                setMobileNav(false);
              }}
              to={"/settings"}
            >
              <FiSettings />
              <p>Settings</p>
            </Link>
          )}
          <Link
            className={`action-container ${activeTab === "Profile" ? "btn-active" : "btn-inactive"}`}
            onClick={() => {
              setActiveTab("Profile");
              setMobileNav(false);
            }}
            to={"/profile"}
          >
            <CgProfile />
            <p>Profile</p>
          </Link>
          {user?.role !== "Teacher" && (
            <div>
              <div className="divider-line"></div>
            </div>
          )}
          {user?.role !== "Teacher" && (
            <Link
              className={`action-container ${activeTab === "Subscription" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setActiveTab("Subscription");
                setMobileNav(false);
              }}
              to={"/subscription"}
            >
              <MdSubscriptions />
              <p>Subscription</p>
            </Link>
          )}
        </div>
      </div>
      <div className="home-main">
        <div className="home-heading">
          <div className="home-heading-right">
            <GiHamburgerMenu
              className="mobile-hamburger"
              onClick={() => setMobileNav(true)}
            />
            <h1>{removeNumbers(activeTab)}</h1>
          </div>
          <div className="home-heading-left">
            <div className="home-heading-right">
              <img src={`http://127.0.0.1:8000${user?.school?.logo}`} alt="" />
              <div>
                <h4>
                  Hi{` `}
                  {user?.full_name?.split(" ")[0] || "User"}
                </h4>
                <p>
                  {user?.is_admin ? "Admin" : "Staff"} | {user?.staff_id}
                </p>
              </div>
            </div>
            {/* <div className="notification-icon">
              <MdNotificationsActive size={23} color="#711a75" />
            </div> */}
            <div className="btn-container home-btn logout">
              <button
                className="btn"
                onClick={() => {
                  logout();
                  navigate("/auth/signin", { replace: true });
                }}
              >
                <MdLogout className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="children">{children}</div>
      </div>
    </div>
  );
};

export default Home;
