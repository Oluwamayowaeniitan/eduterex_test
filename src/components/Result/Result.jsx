import React, { useState } from "react";
import "../StudentBill/StudentBill.css";
import "./Result.css";
import { formatAmount } from "../FormatAmount";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { generatePDF } from "../../utils/Utils";

const Result = ({
  school,
  session,
  term,
  studentClass,
  getGradeAndRemark,
  gradings,
  studentObj,
  filteredSchoolResult,
  addOns,
  tuition,
  watermark,
  watermarkOverlay,
}) => {
  const calculateOverallPercentage = () => {
    const results = filteredSchoolResult(studentObj?.id);
    if (!results || results.length === 0) return 0;

    let totalObtainedScore = 0;
    let totalMaxScore = 0;

    results.forEach((result) => {
      const obtainedScore =
        (result?.ca_score || 0) +
        (result?.test_score || 0) +
        (result?.exam_score || 0);

      // Assuming a maximum score of 100 for CA, Test, and Exam each
      const maxScore =
        term.ca_max_score + term.test_max_score + term.exam_max_score;

      totalObtainedScore += obtainedScore;
      totalMaxScore += maxScore;
    });

    // Calculate and return percentage
    return ((totalObtainedScore / totalMaxScore) * 100).toFixed(2);
  };

  return (
    <div className="sb-bill-container" style={watermark}>
      <div id={`result${studentObj?.id}`} className="id-field">
        <div className="sb-heading">
          <div className="sb-left">
            <img
              src={"http://127.0.0.1:8000" + school?.logo}
              alt=""
              srcset=""
            />
            <div className="sb-school-profile">
              <h3>{school?.name.toUpperCase() ?? "School name"}</h3>
            </div>
          </div>
          <div className="sb-right">
            <p>Report Card</p>
          </div>
        </div>
        <div className="sb-bill-content">
          <div className="sb-student-profile">
            <h4>Name:</h4>
            <p>
              {studentObj?.last_name} {studentObj?.first_name}
            </p>
          </div>
          <div className="sb-student-profile">
            <h4>Student ID:</h4>
            <p>{studentObj?.student_id}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Class:</h4>
            <p>{studentClass?.name}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Acad. Session:</h4>
            <p>{session?.name}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Acad. Term:</h4>
            <p>{term?.name}</p>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>S/N</th>
                  <th>Subjects</th>
                  <th>CA Score ({term?.ca_max_score})</th>
                  <th>Test Score ({term?.test_max_score})</th>
                  <th>Exam Score ({term?.exam_max_score})</th>
                  <th>
                    Total (
                    {term?.ca_max_score +
                      term?.test_max_score +
                      term?.exam_max_score}
                    )
                  </th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchoolResult(studentObj?.id)?.map(
                  (studentResult, index) => (
                    <tr key={index} className="content-style">
                      <td>{index + 1}</td>
                      <td>{studentResult?.subject}</td>
                      <td>{studentResult?.ca_score}</td>
                      <td>{studentResult?.test_score}</td>
                      <td>{studentResult?.exam_score}</td>
                      <td>
                        {studentResult?.ca_score +
                          studentResult?.test_score +
                          studentResult?.exam_score}
                      </td>
                      <td>
                        {
                          getGradeAndRemark(
                            studentResult?.ca_score +
                              studentResult?.test_score +
                              studentResult?.exam_score,
                          ).grade
                        }
                      </td>
                      <td>
                        {
                          getGradeAndRemark(
                            studentResult?.ca_score +
                              studentResult?.test_score +
                              studentResult?.exam_score,
                            gradings,
                          ).remark
                        }
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="result-helper">
            <div className="new-table-style">
              <table>
                <thead>
                  <tr className="heading-style">
                    <th colSpan={3}>Grading System</th>
                  </tr>
                </thead>
                <tbody>
                  {gradings.map((obj, index) => (
                    <tr key={index} className="content-style">
                      <td>{obj?.grade}</td>
                      <td>
                        {obj?.minScore} - {obj?.maxScore}
                      </td>
                      <td>{obj?.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="helper-container">
              <div className="new-table-style">
                <table>
                  <thead>
                    <tr className="heading-style">
                      <th>Class Teacher's Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="content-style comment">
                      <td>{tuition?.result_comment}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="new-table-style bottom-helper">
                <table>
                  <thead>
                    <tr className="heading-style">
                      <th colSpan={2}>Attendance</th>
                      <th>Overall Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="content-style">
                      <td className="bold-text">No. of Days Present</td>
                      <td>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Present",
                        )?.length ?? "N/A"}
                      </td>
                      <td
                        rowSpan={2}
                        className="bold-text"
                        style={{
                          fontSize: "25px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        {calculateOverallPercentage()}%
                      </td>
                    </tr>
                    <tr className="content-style">
                      <td className="bold-text">No. of Days Absent</td>
                      <td>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Absent",
                        )?.length ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="school-signatory">
            <div className="signature">
              <div className="signatory-line"></div>
              <p>Principal's Signature</p>
            </div>
            <div className="signature">
              <div className="signatory-line"></div>
              <p>School Stamp</p>
            </div>
          </div>
          <div className="school-contact-div">
            <p style={{ fontSize: "14px" }}>
              <span>Address: </span>
              {school?.address ?? "Student address"} | <span>Phone: </span>
              {school?.phone_number ?? "phone"} | <span>Email: </span>
              {school?.email ?? "school email"}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {addOns}
        <CustomSmallButton
          text={"Download"}
          icon={<PiArrowCircleDownBold className="use-font-style" />}
          runFunction={() =>
            generatePDF(
              `result${studentObj?.id}`,
              `${studentObj?.last_name}-${studentObj?.first_name}-result.pdf`,
            )
          }
        />
      </div>
      <div
        style={{
          ...watermarkOverlay,
          position: "absolute",
          zIndex: 0, // Ensure this is below all visible elements
        }}
      ></div>
    </div>
  );
};

export default Result;
