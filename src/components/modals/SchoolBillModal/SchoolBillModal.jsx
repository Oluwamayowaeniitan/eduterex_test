import React, { useEffect, useState } from "react";
import "./SchoolBillModal.css";
import StudentBill from "../../StudentBill/StudentBill";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import { useSchool } from "../../../context/SchoolContext";
import { formatAmount } from "../../FormatAmount";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiArrowCircleUpBold } from "react-icons/pi";
import Loading from "../../../utils/Loader";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import { AlertBadge } from "../../AlertBadge";
import AlertModal from "../AlertModal/AlertModal";
import { updatedBill } from "../../../services/schoolService";
import NoRecord from "../../NoRecord";
import Receipt from "../../Receipt/Receipt";

const SchoolBillModal = ({ isVisible, onClose, studentInfo }) => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { schoolStudents, classes, schoolTuition, schoolSession } = schoolState;
  const { authState, logout } = useAuth();

  const tuition = schoolTuition.find((obj) => obj?.student === studentInfo?.id);
  const academic_session = schoolSession.find(
    (obj) => obj?.id === tuition?.academic_session,
  );
  const academic_term = academic_session?.terms.find(
    (obj) => obj.id === tuition?.academic_term,
  );

  const studentClass = classes.find(
    (obj) => obj?.id === tuition?.student_class,
  );

  const { user } = authState;
  const [loading, setLoading] = useState(false);
  const [newBill, setNewBill] = useState([]);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  useEffect(() => {
    if (tuition?.bills) {
      setNewBill([...tuition?.bills]);
    }
  }, [tuition]);

  const checkExtraBills = (obj) => {
    if (newBill.length > 0 && doesObjectExist(newBill, obj)) {
      const updatedBill = newBill?.filter(
        (item) => item?.billName !== obj?.billName,
      );
      setNewBill(updatedBill);
    } else {
      setNewBill([...newBill, obj]);
    }
  };

  const handleAddBill = async () => {
    setLoading(true);

    try {
      const response = await updatedBill(
        JSON.stringify({ student_id: studentInfo?.id, bills: newBill }),
      );
      setLoading(false);
      console.log("response", response);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  if (!isVisible) return null;
  return (
    <div className="modal-overlay sb-container">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <MdClose className="close-modal" onClick={onClose} />
        <div className="sb-card">
          <div className="aside">
            <StudentBill
              school={user?.school}
              student={studentInfo}
              tuition={tuition}
              session={academic_session}
              term={academic_term}
              studentClass={studentClass}
            />
            {academic_term?.extra_bills.length > 0 && (
              <div className="new-table-style">
                <table>
                  <thead>
                    <tr className="heading-style">
                      <th></th>
                      <th>Additional Bills</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academic_term?.extra_bills?.map((obj, index) => (
                      <tr className="content-style">
                        <td style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                          {index + 1}.{" "}
                          <input
                            type="checkbox"
                            checked={doesObjectExist(newBill, obj)}
                            onChange={() => checkExtraBills(obj)}
                          />
                        </td>

                        <td>{obj?.billName}</td>
                        <td>₦{formatAmount(obj?.billAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <CustomSmallButton
                  text={loading ? <Loading /> : "Update Bill"}
                  icon={<PiArrowCircleUpBold />}
                  disabled={loading}
                  runFunction={handleAddBill}
                />
              </div>
            )}
          </div>
          <div className="main">
            {tuition?.payments?.length > 0 ? (
              tuition?.payments?.map((_, index) => (
                <Receipt
                  school={user?.school}
                  student={studentInfo}
                  tuition={tuition}
                  session={academic_session}
                  term={academic_term}
                  studentClass={studentClass}
                  id={index}
                />
              ))
            ) : (
              <NoRecord
                message={
                  "No payment record found for this term. Student payment receipt will appear here."
                }
              />
            )}
          </div>
        </div>
        <AlertModal
          isVisible={modalMessage ? true : false}
          onClose={() => setModalMessage("")}
          message={modalMessage}
          success={successStatus}
        />
      </div>
    </div>
  );
};

export default SchoolBillModal;
