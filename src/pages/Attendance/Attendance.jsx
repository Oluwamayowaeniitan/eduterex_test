import React, { useEffect, useState } from "react";
import "./Attendance.css";
import { Link, useLocation } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { getMonthsBetweenDates, getMonthsWeeksDays } from "../../utils/Utils";
import Loading from "../../utils/Loader";
import { markAttendance } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import NoRecord from "../../components/NoRecord";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";

const Attendance = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { schoolStudents, schoolSession, schoolTuition } = schoolState;

  const location = useLocation();
  const { state } = location || {}; // Get state from location
  const { className, classId } = state || {};
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [attendance, setAttendance] = useState({});
  const [sessionId, setSessionId] = useState();
  const [termId, setTermId] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    return `${day}/${month}`;
  };

  function formattedDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    return `${formattedDay}/${formattedMonth}`;
  }

  const currentDate = getFormattedDate();

  const { start_date, end_date } =
    schoolSession
      ?.find((obj) => obj?.is_active === true)
      ?.terms.find((obj) => obj?.is_active === true) || {};

  useEffect(() => {
    // Generate calendar when start_date and end_date are available
    if (start_date && end_date) {
      const result = getMonthsWeeksDays(start_date, end_date);
      setCalendar(result);
    }
  }, [start_date, end_date]);

  useEffect(() => {
    schoolStudents?.map((student) => {
      if (student?.attendance?.length > 0) {
        return setAttendance((prev) => ({
          ...prev,
          [student.id]: {
            ...prev[student.id],
            [formattedDate(student?.attendance?.at(-1)?.date)]:
              student?.attendance.at(-1)?.status === "Present" || false,
          },
        }));
      }
    });
  }, [schoolStudents]);

  useEffect(() => {
    const session = schoolSession?.find((obj) => obj?.is_active === true);
    setSessionId(session?.id || null);
    const term = session?.terms?.find((obj) => obj?.is_active === true);
    setTermId(term?.id || null);
  }, [schoolSession]);

  const toggleAttendance = (studentId, date) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: !prev[studentId]?.[date],
      },
    }));
  };

  const handleSubmitAttendance = async () => {
    const body = JSON.stringify({
      attendance: attendance,
      session: sessionId,
      term: termId,
    });
    setLoading(true);

    try {
      const response = await markAttendance(body);
      setLoading(false);
      console.log("response", response.message);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const previousAttendance = (day, student) => {
    const is_present =
      student.attendance?.find((obj) => formattedDate(obj.date) === day)
        ?.status === "Present" || false;

    return is_present;
  };

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = schoolTuition
    .filter(
      (obj) =>
        obj?.student_class === classId && obj?.academic_session === sessionId,
    )
    .map((obj) => getStudent(obj?.student));

  return (
    <div className="attendance-container">
      <div className="student-class">
        <h2>{className}</h2>
      </div>
      <div className="attendance-calendar">
        <CgChevronLeftO
          className="attendance-icon"
          onClick={() => setCurrentMonth((prev) => Math.max(prev - 1, 0))}
        />
        <p>{calendar[currentMonth]?.name || ""}</p>
        <CgChevronRightO
          className="attendance-icon"
          onClick={() =>
            setCurrentMonth((prev) => Math.min(prev + 1, calendar.length - 1))
          }
        />
      </div>
      {filteredStudents.length > 0 ? (
        <div className="new-table-style">
          <table>
            <thead>
              <tr className="heading-style">
                <th>S/N</th>
                <th style={{ width: "400px" }}>Names of Students</th>
                {calendar[currentMonth]?.weeks.flat().map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id || index} className="content-style">
                  <td>{index + 1}</td>
                  <td>{`${student.last_name} ${student.first_name}`}</td>
                  {calendar[currentMonth]?.weeks.flat().map((day, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="checkbox"
                        checked={
                          day !== currentDate
                            ? previousAttendance(day, student)
                            : attendance[student.id]?.[day] || false
                        }
                        disabled={day !== currentDate ? true : false}
                        onChange={() => toggleAttendance(student.id, day)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-record-container">
          <NoRecord
            message="No students found in this class."
            addon={
              <Link to={"/registration"}>
                <CustomSmallButton
                  text={"Add Student"}
                  icon={<PiPlusCircleBold style={{ fontSize: "20px" }} />}
                />
              </Link>
            }
          />
        </div>
      )}
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
      <CustomSmallButton
        text={loading ? <Loading /> : "Submit Attendance"}
        runFunction={handleSubmitAttendance}
        icon={<PiCheckCircleBold style={{ fontSize: "20px" }} />}
        disabled={loading}
      />
    </div>
  );
};

export default Attendance;
//
