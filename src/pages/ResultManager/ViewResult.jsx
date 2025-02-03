import React, { useEffect, useMemo, useState } from "react";
import "./ResultManager.css";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import NoRecord from "../../components/NoRecord";
import { Link } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import { BiSearch } from "react-icons/bi";
import { approveResult, updatedBill } from "../../services/schoolService";
import Loading from "../../utils/Loader";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import Result from "../../components/Result/Result";
import { useAuth } from "../../context/AuthContext";
import CustomSectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { FiUser } from "react-icons/fi";
import { generatePDF } from "../../utils/Utils";
import { transform } from "framer-motion";

const ViewResult = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const {
    classes,
    schoolStudents,
    schoolSession,
    schoolResult,
    schoolTuition,
  } = schoolState;

  const [classId, setClassId] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [termId, setTermId] = useState(null);
  const [search, setSearch] = useState("");
  const [gradings, setGradings] = useState([]);
  const [loading, setLoading] = useState({
    approve: false,
    comment: false,
    resultDownload: false,
  });
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const { authState, logout } = useAuth();
  const { user } = authState;

  const [studentId, setStudentId] = useState(null);
  const [studentComment, setStudentComment] = useState("");

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = useMemo(() => {
    return schoolTuition
      .filter(
        (obj) =>
          obj?.student_class === classes[classId]?.id &&
          obj?.academic_session === sessionId,
      )
      .map((obj) => getStudent(obj?.student));
  }, [schoolTuition, classId, sessionId]);

  const searchFilteredStudents = (search) => {
    return filteredStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(search.toLowerCase()) ||
        student.middle_name.toLowerCase().includes(search.toLowerCase()) ||
        student.last_name.toLowerCase().includes(search.toLowerCase()) ||
        search.toLowerCase().includes(student?.first_name.toLowerCase()) ||
        search.toLowerCase().includes(student?.last_name.toLowerCase()) ||
        search.toLowerCase().includes(student?.middle_name.toLowerCase()) ||
        student.student_id.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const filteredSchoolResult = (id) => {
    return schoolResult?.filter(
      (student) =>
        student.student_class === classes[classId].id &&
        student?.student === id &&
        student?.academic_session === sessionId &&
        student?.academic_term === termId,
    );
  };

  useEffect(() => {
    const activeSession = schoolSession?.find((obj) => obj?.is_active);
    setSessionId(activeSession?.id || null);
    setGradings(activeSession?.gradings || []);

    const activeTerm = activeSession?.terms?.find((term) => term?.is_active);
    setTermId(activeTerm?.id || null);
  }, [schoolSession]);

  const getGradeAndRemark = (score) => {
    const gradeList =
      schoolSession?.find((obj) => obj?.is_active)?.gradings || [];
    for (let gradeInfo of gradeList) {
      if (score >= gradeInfo.minScore && score <= gradeInfo.maxScore) {
        return {
          grade: gradeInfo.grade,
          remark: gradeInfo.remark,
        };
      }
    }

    // Return a default value for invalid scores
    return {
      grade: "Invalid",
      remark: "Score out of range",
    };
  };

  const handleApproveResult = async (student_list) => {
    const body = JSON.stringify({
      student_list: student_list,
      current_session: sessionId,
      current_term: termId,
      current_class: classes[classId]?.name,
    });

    setLoading({ ...loading, approve: true });

    try {
      const response = await approveResult(body);
      setLoading({ ...loading, approve: false });

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
      setMessage("An error occurred while submitting results.");
      setSuccessStatus(false);
    }
  };

  const handleComment = async () => {
    setLoading({ ...loading, comment: true });

    try {
      const response = await updatedBill(
        JSON.stringify({
          student_id: studentId,
          student_comment: studentComment,
        }),
      );
      setLoading({ ...loading, comment: false });

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

  const checkApprovedStatus = (studentId) => {
    return schoolTuition.find((obj) => obj.student === studentId)
      ?.approved_result;
  };

  const academic_session = schoolSession.find((obj) => obj?.id === sessionId);
  const academic_term = academic_session?.terms.find(
    (obj) => obj.id === termId,
  );

  const downloadALLResult = () => {
    setLoading({ ...loading, resultDownload: true });
    filteredStudents.map((studentObj) =>
      generatePDF(
        `result${studentObj?.id}`,
        `${studentObj?.last_name}-${studentObj?.first_name}-result.pdf`,
      ),
    );
    setLoading({ ...loading, resultDownload: false });
  };

  const getWaterMark = (img) => ({
    position: "relative", // Allow child elements to stack properly
    width: "100%",
    height: "100%",
    padding: "10px",
    zIndex: 0, // Background watermark stays below content
  });

  const watermarkOverlay = (img) => ({
    content: "''", // Necessary for pseudo-element
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    backgroundImage: `url(http://127.0.0.1:8000${img})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    opacity: 0.1,
    zIndex: -1,
  });

  return (
    <div className="result-container">
      {/* <div className="student-class">
        <h2>{className}</h2>
      </div> */}
      <div className="vr-action-container">
        <div className="search-container">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for students by name, or student id"
          />
          <BiSearch className="search-icon" />
        </div>
        <div className="result-calendar">
          <CgChevronLeftO
            className="result-icon"
            onClick={() => setClassId((prev) => Math.max(prev - 1, 0))}
          />
          <h3>{classes && classes[classId]?.name}</h3>
          <CgChevronRightO
            className="result-icon"
            onClick={() =>
              setClassId((prev) => Math.min(prev + 1, classes.length - 1))
            }
          />
        </div>
        <div className="vr-action-btn">
          <CustomSmallButton
            text={loading.approve ? <Loading /> : `Approve all`}
            icon={<PiCheckCircleBold style={{ fontSize: "20px" }} />}
            runFunction={() =>
              handleApproveResult(filteredStudents.map((student) => student.id))
            }
            disabled={loading.approve}
          />
          <CustomSmallButton
            text={loading.resultDownload ? <Loading /> : `Download all`}
            icon={<PiArrowCircleDownBold style={{ fontSize: "20px" }} />}
            runFunction={downloadALLResult}
            disabled={loading.resultDownload}
          />
        </div>
      </div>
      {filteredStudents.length > 0 ? (
        <div className="vr-card-container">
          <div className="vr-left">
            {searchFilteredStudents(search).map((obj, index) => (
              <div key={index} className="vr-card">
                <Result
                  watermark={getWaterMark(user?.school?.logo)}
                  watermarkOverlay={watermarkOverlay(user?.school?.logo)}
                  studentObj={obj}
                  session={academic_session}
                  term={academic_term}
                  filteredSchoolResult={filteredSchoolResult}
                  gradings={gradings}
                  school={user?.school}
                  getGradeAndRemark={getGradeAndRemark}
                  studentClass={classes[classId]}
                  tuition={schoolTuition.find(
                    (item) => item?.student === obj?.id,
                  )}
                  addOns={
                    <CustomSmallButton
                      text={
                        checkApprovedStatus(obj?.id) ? (
                          "Approved"
                        ) : loading.approve ? (
                          <Loading />
                        ) : (
                          `Approve`
                        )
                      }
                      icon={<PiCheckCircleBold className="use-font-style" />}
                      disabled={checkApprovedStatus(obj?.id) || loading.approve}
                      runFunction={() => handleApproveResult([obj.id])}
                    />
                  }
                />
              </div>
            ))}
          </div>
          <div className="vr-right">
            <CustomSectionInput
              icon={<FiUser />}
              placeholder={"Select student to comment..."}
              name={"student_obj"}
              options={filteredStudents.map((student) => ({
                value: student.id,
                label: `${student.first_name} ${student.middle_name} ${student.last_name}`,
              }))}
              handleChange={(e) => setStudentId(e.target.value)}
              value={studentId}
            />
            <textarea
              name="comment"
              id=""
              placeholder="Comment on student result..."
              value={studentComment}
              onChange={(e) => setStudentComment(e.target.value)}
            ></textarea>
            <CustomSmallButton
              text={loading.comment ? <Loading /> : `Comment...`}
              runFunction={handleComment}
              disabled={loading.comment}
            />
          </div>
        </div>
      ) : (
        <div className="no-record-container">
          <NoRecord message="No students found in this class." />
        </div>
      )}
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  );
};

export default ViewResult;
