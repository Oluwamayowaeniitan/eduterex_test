import React from "react";
import "./AdminDashboard.css";
import {
  FaChalkboardTeacher,
  FaDollarSign,
  FaFemale,
  FaGraduationCap,
  FaMale,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";
import { useSchool } from "../../context/SchoolContext";
import { MdOutlineSchool } from "react-icons/md";
import DataPieChart from "../../components/DataPieChart";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import AttendanceChart from "../../components/AttendanceChart";
import TuitionChart from "../../components/TuitionChart";
import DateDisplay from "../../components/DateCard";
import { formatAmount } from "../../components/FormatAmount";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { schoolStudents, schoolSession, schoolTuition, schoolStaffList } =
    schoolState;
  const { authState } = useAuth();
  const { user } = authState;

  function calculateFees() {
    let totalReceivedFees = 0;
    let totalExpectedFees = 0;

    schoolTuition?.forEach((account) => {
      // Add to total received fees
      totalReceivedFees += parseFloat(account.amount_paid);

      // Add to total expected fees
      totalExpectedFees += parseFloat(account.total_fee);
    });

    return {
      totalReceivedFees: totalReceivedFees.toFixed(2),
      totalExpectedFees: totalExpectedFees.toFixed(2),
    };
  }

  const topCardList = [
    {
      icon: <FaUserGraduate />,
      title: "Students",
      count: schoolStudents?.length || 0,
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Teachers",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Teacher")?.length || 0,
    },
    {
      icon: <MdOutlineSchool />,
      title: "Principals",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Principal")?.length ||
        0,
    },
    {
      icon: <FaUserShield />,
      title: "Admins",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Admin")?.length || 0,
    },
  ];
  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="d-top-cards">
          {topCardList.map((card, index) => (
            <div className={`d-card ${index % 2 === 0 ? "d-card-dark" : ""}`}>
              <div
                className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
              >
                {card.icon}
              </div>
              <div>
                <h3>{card.count}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="d-middle-cards">
          <div className="d-student-chart">
            <div className="d-student-chart-header">
              <p>Student</p>
              <div
                className="d-card-icon"
                style={{ width: "35px", height: "35px" }}
              >
                <FaUserGraduate style={{ fontSize: "14px" }} />
              </div>
            </div>
            <DataPieChart
              data={[
                {
                  name: "No. of Male Students",
                  value:
                    schoolStudents?.filter((obj) => obj?.gender === "Male")
                      ?.length || 0,
                },
                {
                  name: "No. of Female Students",
                  value:
                    schoolStudents?.filter((obj) => obj?.gender === "Female")
                      ?.length || 0,
                },
              ]}
              COLORS={["#711a75", "#ffadbc"]}
              centerIcons={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <FaMale style={{ fontSize: "50px", color: "#711a75" }} />
                  <FaFemale style={{ fontSize: "50px", color: "#ffadbc" }} />
                </div>
              }
            />
          </div>
          <div className="d-attendance-chart">
            <AttendanceChart />
          </div>
        </div>
        {user?.role !== "Teacher" && (
          <div className="d-tuition-chart">
            <div className="d-student-chart-header">
              <p>Fees Inflow</p>
              <div
                className="d-card-icon"
                style={{ width: "35px", height: "35px" }}
              >
                <FaDollarSign style={{ fontSize: "14px" }} />
              </div>
            </div>
            <TuitionChart />
          </div>
        )}
      </div>
      <div className="dashboard-aside">
        <DateDisplay />
        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card">
              <div className="d-card-icon">
                <FaDollarSign style={{ fontSize: "14px" }} />
              </div>
              <div>
                <h3>₦{formatAmount(calculateFees().totalReceivedFees)}</h3>
                <p>Received Fees</p>
              </div>
            </div>
          </div>
        )}
        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card-dark">
              <div className="d-card-icon-dark">
                <FaDollarSign style={{ fontSize: "14px" }} />
              </div>
              <div>
                <h3>₦{formatAmount(calculateFees().totalExpectedFees)}</h3>
                <p>Expected Fees</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
