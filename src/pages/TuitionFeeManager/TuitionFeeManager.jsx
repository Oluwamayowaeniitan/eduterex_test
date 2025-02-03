import React, { useState } from "react";
import "./TuitionFeeManager.css";
import { BiFilter, BiSearch } from "react-icons/bi";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { GrActions } from "react-icons/gr";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiPlusCircleBold } from "react-icons/pi";
import { useSchool } from "../../context/SchoolContext";
import NoRecord from "../../components/NoRecord";
import { BsEye } from "react-icons/bs";
import { formatDate } from "../../utils/Utils";
import AddPaymentModal from "../../components/modals/AddPaymentModal/AddPaymentModal";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { addTuitionFee } from "../../services/schoolService";
import SchoolBillModal from "../../components/modals/SchoolBillModal/SchoolBillModal";

const TuitionFeeManager = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { schoolStudents, classes, schoolTuition, schoolSession } = schoolState;

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [selectedList, setSelectedList] = useState([]);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const handleOpenPaymentModal = () => setIsPaymentModalVisible(true);
  const handleClosePaymentModal = () => setIsPaymentModalVisible(false);

  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const handleOpenBillModal = () => setIsBillModalVisible(true);
  const handleCloseBillModal = () => setIsBillModalVisible(false);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const [data, setData] = useState({});

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const handleSelection = (id) => {
    const student = schoolTuition.find((student) => student.student === id);
    return {
      student_name: `${getStudent(student?.student)?.last_name} ${getStudent(student?.student)?.first_name}`,
      student_id: getStudent(student?.student)?.student_id,
      session: schoolSession.find((obj) => obj.id === student?.academic_session)
        ?.name,
      term: schoolSession
        .find((obj) => obj.id === student?.academic_session)
        ?.terms.find((obj) => obj.id === student?.academic_term)?.name,
      balance: parseInt(student?.balance),
    };
  };

  const handleAddPayment = () => {
    if (selectedList.length > 0) {
      if (selectedList.length > 1) {
        setSuccessStatus(false);
        setModalMessage("Please select only one student to add payment.");
        return;
      } else if (handleSelection(selectedList[0]).balance === 0) {
        setSuccessStatus(true);
        setModalMessage("This student has no outstanding payment.");
        return;
      }
      setData(handleSelection(selectedList[0]));
      handleOpenPaymentModal();
    } else {
      setModalMessage("Please select a student to add payment.");
    }
  };

  const toggleIdInList = (id) => {
    setSelectedList((prevList) => {
      if (prevList.includes(id)) {
        return prevList.filter((item) => item !== id);
      } else {
        return [...prevList, id];
      }
    });
  };

  const handleSubmitPayment = async (formData, setMessage, setLoading) => {
    setLoading(true);

    try {
      const response = await addTuitionFee(JSON.stringify(formData));
      setLoading(false);
      console.log("response", response);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        handleClosePaymentModal();
        setModalMessage(response.message);
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

  const [search, setSearch] = useState("");

  const filterStudents = (search) => {
    return schoolStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(search.toLowerCase()) ||
        student.last_name.toLowerCase().includes(search.toLowerCase()) ||
        student.student_id.toLowerCase().includes(search.toLowerCase()) ||
        classes
          .find((obj) => obj.id === student?.student_class)
          ?.name.toLowerCase()
          .includes(search.toLowerCase()),
    );
  };

  const filterStudentsTuition = (search) => {
    return schoolTuition.filter(
      (student) =>
        getStudent(student.student)
          .first_name.toLowerCase()
          .includes(search.toLowerCase()) ||
        getStudent(student.student)
          .last_name.toLowerCase()
          .includes(search.toLowerCase()) ||
        getStudent(student.student)
          .student_id.toLowerCase()
          .includes(search.toLowerCase()) ||
        classes
          .find((obj) => obj.id === student?.student_class)
          ?.name.toLowerCase()
          .includes(search.toLowerCase()),
    );
  };

  return (
    <div className="tfm-container">
      <div className="tfm-heading">
        <div className="tfm-filter">
          <BiFilter className="tfm-filter-icon" />
          <p>Filter</p>
        </div>
        <div className="search-container">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, student id, and class."
          />
          <BiSearch className="search-icon" />
        </div>
      </div>
      {filterStudents(search).length > 0 ? (
        <div className="tfm-table-container">
          <div className="tfm-tc-heading">
            <div className="tfm-action">
              <h4>Action: </h4>
              <CustomSelectionInput
                placeholder={""}
                name={"action"}
                value={"action"}
                handleChange={() => console.log("nothing")}
                data={[
                  "Send notification message to parent",
                  "Send payment receipts to parents",
                ]}
                icon={<GrActions className="icons" />}
                small={true}
              />
              <CustomSmallButton text={"Go"} />
            </div>
            <div className="tfm-add">
              <CustomSmallButton
                text={"Add Payment"}
                icon={<PiPlusCircleBold style={{ fontSize: "20px" }} />}
                runFunction={handleAddPayment}
              />
            </div>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th></th>
                  <th></th>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>School Fee</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Last Payment Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterStudentsTuition(search).map((student, index) => (
                  <tr key={student.id} className="content-style">
                    <td>
                      {index + 1}.{" "}
                      <input
                        type="checkbox"
                        checked={selectedList?.includes(
                          getStudent(student.student)?.id,
                        )}
                        onChange={() =>
                          toggleIdInList(getStudent(student.student)?.id)
                        }
                      />
                    </td>
                    <td>
                      <img
                        src={
                          getStudent(student.student)?.passport
                            ? `http://127.0.0.1:8000${getStudent(student.student).passport}`
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={`${student.first_name} ${student.last_name}`}
                        className="profile-image"
                      />
                    </td>
                    <td>
                      {getStudent(student.student)?.last_name}{" "}
                      {getStudent(student.student)?.first_name}
                    </td>
                    <td>{getStudent(student.student)?.student_id || "N/A"}</td>
                    <td>
                      {
                        classes.find((obj) => obj.id === student?.student_class)
                          ?.name
                      }
                    </td>
                    <td>{student?.total_fee}</td>
                    <td>{student.amount_paid}</td>
                    <td>{student.balance}</td>
                    <td>
                      {student?.payments?.length > 0
                        ? formatDate(student?.payments.at(-1)?.payment_date)
                        : "N/A"}
                    </td>
                    <td>
                      {student.status ? (
                        <p className="tuition-cleared">Cleared</p>
                      ) : (
                        <p className="tuition-not-cleared">Unpaid</p>
                      )}
                    </td>
                    <td>
                      <BsEye
                        className="action-icon"
                        onClick={() => {
                          setStudentInfo(getStudent(student.student));
                          handleOpenBillModal();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddPaymentModal
            isVisible={isPaymentModalVisible}
            onClose={handleClosePaymentModal}
            isLoading={isPaymentLoading}
            setIsLoading={setIsPaymentLoading}
            handlePayment={handleSubmitPayment}
            data={data}
          />
          <AlertModal
            isVisible={modalMessage ? true : false}
            onClose={() => setModalMessage("")}
            message={modalMessage}
            success={successStatus}
          />
          <SchoolBillModal
            isVisible={isBillModalVisible}
            onClose={handleCloseBillModal}
            studentInfo={studentInfo}
          />
        </div>
      ) : (
        <NoRecord message="No record found." />
      )}
    </div>
  );
};

export default TuitionFeeManager;
