import React, { useEffect, useState } from "react";
import "./Settings.css";
import { useSchool } from "../../context/SchoolContext";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { BsTrash, BsTrash2Fill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { settingsHandler } from "../../services/schoolService";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import Loading from "../../utils/Loader";

const Settings = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const {
    classes,
    schoolStudents,
    schoolSession,
    schoolResult,
    schoolTuition,
  } = schoolState;
  const [sessionId, setSessionId] = useState(null);
  const [termId, setTermId] = useState(null);
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [gradingList, setGradingList] = useState(null);
  const [loading, setLoading] = useState({
    grading: false,
    scores: false,
  });

  const [caMaxScore, setCaMaxScore] = useState(0);
  const [testMaxScore, setTestMaxScore] = useState(0);
  const [examMaxScore, setExamMaxScore] = useState(0);

  useEffect(() => {
    const activeSession = schoolSession?.find((obj) => obj?.is_active);
    setSessionId(activeSession?.id || null);

    const activeTerm = activeSession?.terms?.find((term) => term?.is_active);
    setTermId(activeTerm?.id || null);

    setGradingList(activeSession?.gradings || []);
    setCaMaxScore(activeTerm?.ca_max_score);
    setTestMaxScore(activeTerm?.test_max_score);
    setExamMaxScore(activeTerm?.exam_max_score);
  }, [schoolSession]);

  const handleSettings = async (data, label) => {
    if (label === "grading") {
      if (data?.grading.length <= 0) {
        setMessage("Your gradings metric table cannot be empty.");
        setSuccessStatus(false);
        return;
      }
      for (let obj in data?.grading) {
        const isValid = isFormValid(data?.grading[obj], setMessage);
        if (isValid !== true) {
          console.log("omo");
          setSuccessStatus(false);
          return;
        }
      }
    } else if (label === "scores") {
      const isValid = isFormValid(data?.scores, setMessage);
      if (isValid !== true) {
        setSuccessStatus(false);
        return;
      }
    }

    setLoading({ ...loading, [label]: true });
    try {
      const response = await settingsHandler(JSON.stringify(data));
      setLoading({ ...loading, [label]: false });

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

  return (
    <div className="settings-container">
      <div className="all-settings">
        <div className="setting-card">
          <h3>Grading Settings</h3>
          <p>
            Changing these fields will affect other datas that depends on this
            data for this current session.
          </p>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>Min. Score</th>
                  <th>Max. Score</th>
                  <th>Grade</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gradingList?.map((obj, index) => (
                  <tr key={index} className="content-style">
                    <td>
                      <input
                        type="number"
                        name="minScore"
                        value={obj?.minScore}
                        onChange={(e) => {
                          setGradingList((prev) => {
                            prev[index].minScore = e.target.value;
                            return [...prev];
                          });
                        }}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="maxScore"
                        value={obj?.maxScore}
                        onChange={(e) => {
                          setGradingList((prev) => {
                            prev[index].maxScore = e.target.value;
                            return [...prev];
                          });
                        }}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="grade"
                        value={obj?.grade}
                        onChange={(e) => {
                          setGradingList((prev) => {
                            prev[index].grade = e.target.value;
                            return [...prev];
                          });
                        }}
                        maxLength={2}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="grade"
                        value={obj?.remark}
                        onChange={(e) => {
                          setGradingList((prev) => {
                            prev[index].remark = e.target.value;
                            return [...prev];
                          });
                        }}
                        maxLength={20}
                        id=""
                      />
                    </td>
                    <td>
                      <FaTrash
                        className="icon"
                        style={{ padding: "5px", cursor: "pointer" }}
                        onClick={() => {
                          const newGradingList = gradingList?.filter(
                            (_, objIndex) => objIndex !== index,
                          );
                          setGradingList(newGradingList);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="setting-action-buttons">
            <CustomSmallButton
              text={"Add"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              runFunction={() =>
                setGradingList([
                  ...gradingList,
                  {
                    minScore: "",
                    maxScore: "",
                    grade: "",
                    remark: "",
                  },
                ])
              }
            />
            <CustomSmallButton
              text={loading.grading ? <Loading /> : `Update Gradings`}
              disabled={loading.grading}
              runFunction={() =>
                handleSettings({ grading: gradingList }, "grading")
              }
              icon={<PiCheckCircleBold className="use-font-style" />}
            />
          </div>
        </div>
        <div className="setting-card">
          <h3>Assessment Maximum Grading Settings</h3>
          <p>
            Changing these fields will affect other datas that depends on this
            data for this current session.
          </p>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>CA Max. Score</th>
                  <th>Test Max. Score</th>
                  <th>Exam Max. Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="content-style">
                  <td>
                    <input
                      type="number"
                      name="ca_max_score"
                      value={caMaxScore}
                      onChange={(e) => {
                        setCaMaxScore(e.target.value);
                      }}
                      id=""
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="test_max_score"
                      value={testMaxScore}
                      onChange={(e) => setTestMaxScore(e.target.value)}
                      id=""
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="exam_max_score"
                      value={examMaxScore}
                      onChange={(e) => setExamMaxScore(e.target.value)}
                      id=""
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="setting-action-button-single">
            <CustomSmallButton
              text={loading.scores ? <Loading /> : `Update Scores`}
              disabled={loading.scores}
              runFunction={() =>
                handleSettings(
                  {
                    scores: {
                      ca_score: caMaxScore,
                      test_score: testMaxScore,
                      exam_score: examMaxScore,
                    },
                  },
                  "scores",
                )
              }
              icon={<PiCheckCircleBold className="use-font-style" />}
            />
          </div>
        </div>
      </div>
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  );
};

export default Settings;
