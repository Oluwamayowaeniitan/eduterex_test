import React, { useState, useEffect } from "react";
import "./SchoolAccountManager.css";
import DataPieChart from "../../components/DataPieChart";
import { useSchool } from "../../context/SchoolContext";
import { formatAmount } from "../../components/FormatAmount";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { FaDollarSign } from "react-icons/fa";
import TuitionSessionChart from "../../components/SessionTuitionChart";

const SchoolAccountManager = () => {
  const { schoolState } = useSchool();
  const { classes, sessionAccount, schoolSession } = schoolState;
  const [sessionId, setSessionId] = useState();
  const [termId, setTermId] = useState();
  const [classesAccount, setClassesAccount] = useState([]);
  const [overallAnalysis, setOverallAnalysis] = useState([]);

  const session = schoolSession?.find((obj) => obj?.is_active === true);
  useEffect(() => {
    setSessionId(session?.id || null);
    const term = session?.terms?.find((obj) => obj?.is_active === true);
    setTermId(term?.id || null);
  }, [session]);

  const classAccount = (classId) => {
    const returnedData = [];
    const classAccount = sessionAccount.filter(
      (account) => account.student_class === classId,
    );

    const termIds = session?.terms.map((term) => term.id) || [];

    // Ensure termIds always has 3 elements
    while (termIds.length < 3) {
      termIds.push(`dummy-${termIds.length + 1}`);
    }

    console.log("TermIds", termIds);

    termIds?.forEach((term_id) => {
      const fees = {
        term_name: "N/A",
        receivedFees: 0,
        expectedFees: 0,
        noFullPayment: 0,
        noPartPayment: 0,
        noNoPayment: 0,
        percentagePaid: 0,
      };

      if (!term_id.toString().startsWith("dummy")) {
        classAccount?.forEach((account) => {
          if (account.academic_term === term_id) {
            fees.noFullPayment +=
              parseInt(account.amount_paid) === parseInt(account.total_fee)
                ? 1
                : 0;
            fees.noPartPayment +=
              parseInt(account.amount_paid) > 0 &&
              parseInt(account.amount_paid) < account.total_fee
                ? 1
                : 0;
            fees.noNoPayment += parseInt(account.amount_paid) === 0 ? 1 : 0;
            fees.receivedFees += parseFloat(account.amount_paid);
            fees.expectedFees += parseFloat(account.total_fee);
          }
        });

        fees.percentagePaid = fees.expectedFees
          ? (fees.receivedFees / fees.expectedFees) * 100
          : 0;
        fees.term_name = session.terms.find(
          (term) => term.id === term_id,
        )?.name;
      } else {
        fees.noFullPayment = 0;
        fees.noPartPayment = 0;
        fees.noNoPayment = 0;
        fees.receivedFees = 0;
        fees.expectedFees = 0;

        fees.percentagePaid = fees.expectedFees
          ? (fees.receivedFees / fees.expectedFees) * 100
          : 0;
        fees.term_name = "N/A";
      }

      returnedData.push(fees); // Push a fresh fees object each time
    });

    return returnedData;
  };

  useEffect(() => {
    const accounts =
      classes?.map((classItem) => classAccount(classItem.id)) || [];
    setClassesAccount(accounts);
    setOverallAnalysis(analyzeData(accounts));
  }, [classes, sessionAccount, session]);

  function analyzeData(data) {
    // Helper function to calculate percentage paid
    const calculatePercentage = (received, expected) =>
      expected > 0 ? (received / expected) * 100 : 0;

    // Initialize overall session and term-specific analyses
    const overallAnalysis = {
      name: "Overall",
      receivedFees: 0,
      expectedFees: 0,
      percentagePaid: 0,
    };

    const termAnalyses = {
      "First Term": {
        name: "First Term",
        receivedFees: 0,
        expectedFees: 0,
        percentagePaid: 0,
      },
      "Second Term": {
        name: "Second Term",
        receivedFees: 0,
        expectedFees: 0,
        percentagePaid: 0,
      },
      "Third Term": {
        name: "Third Term",
        receivedFees: 0,
        expectedFees: 0,
        percentagePaid: 0,
      },
    };

    // Process data
    console.log("Data", data);
    data.forEach((session) => {
      session.forEach((term) => {
        if (!term.term_name.toString().startsWith("N/A")) {
          const termName = term.term_name;

          // Update term-specific data
          termAnalyses[termName].receivedFees += term.receivedFees;
          termAnalyses[termName].expectedFees += term.expectedFees;

          // Update overall data
          overallAnalysis.receivedFees += term.receivedFees;
          overallAnalysis.expectedFees += term.expectedFees;
        }
      });
    });

    // Calculate percentages
    Object.values(termAnalyses).forEach((term) => {
      term.percentagePaid = calculatePercentage(
        term.receivedFees,
        term.expectedFees,
      ).toFixed(2);
    });

    overallAnalysis.percentagePaid = calculatePercentage(
      overallAnalysis.receivedFees,
      overallAnalysis.expectedFees,
    ).toFixed(2);

    // Combine results
    return [
      overallAnalysis,
      termAnalyses["First Term"],
      termAnalyses["Second Term"],
      termAnalyses["Third Term"],
    ];
  }

  function getColor(noFullPayment, noPartPayment, noNoPayment) {
    const max = Math.max(noFullPayment, noPartPayment, noNoPayment);

    if (max === noFullPayment) {
      return "#28a745";
    } else if (max === noPartPayment) {
      return "#6A5ACD";
    } else if (max === noNoPayment) {
      return "#dc3545";
    } else {
      return "gray";
    }
  }

  const [currentClass, setCurrentClass] = useState(0);

  return (
    <div className="sam-container">
      <div className="sam-sub-container">
        <div className="sam-main overflow">
          <div className="result-calendar">
            <CgChevronLeftO
              className="result-icon"
              onClick={() => setCurrentClass((prev) => Math.max(prev - 1, 0))}
            />
            <h3>{classes && classes[currentClass]?.name}</h3>
            <CgChevronRightO
              className="result-icon"
              onClick={() =>
                setCurrentClass((prev) =>
                  Math.min(prev + 1, classes.length - 1),
                )
              }
            />
          </div>
          <div className="class-card">
            <div className="term-card-container">
              {classesAccount[currentClass]?.map((obj, index) => (
                <div className="term-card" key={index}>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign style={{ fontSize: "14px" }} />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.receivedFees ?? 0)}</h3>
                        <p>Received Fees</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign style={{ fontSize: "14px" }} />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.expectedFees ?? 0)}</h3>
                        <p>Expected Fees</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box-inline ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <p className="student-percentage">
                        <span
                          style={{
                            color: getColor(
                              obj.noFullPayment,
                              obj.noPartPayment,
                              obj.noNoPayment,
                            ),
                            fontWeight: "600",
                          }}
                        >
                          {Number(obj.percentagePaid).toFixed(0)}%
                        </span>{" "}
                        payment received
                      </p>
                    </div>
                  </div>

                  <div
                    className={`term-name-badge ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <p>{obj.term_name}</p>
                  </div>
                  <div className="account-chart">
                    <DataPieChart
                      data={[
                        {
                          name: "No. of Full Payment",
                          value: obj.noFullPayment,
                        },
                        {
                          name: "No. of Part Payment",
                          value: obj.noPartPayment,
                        },
                        {
                          name: "No. of No Payment",
                          value: obj.noNoPayment,
                        },
                      ]}
                      COLORS={["#28a745", "#FFC107", "#dc3545"]}
                      centerText={
                        obj.noFullPayment + obj.noPartPayment + obj.noNoPayment
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-tuition-chart">
            <div className="d-student-chart-header">
              <p>Session Fees Inflow</p>
              <div
                className="d-card-icon"
                style={{ width: "35px", height: "35px" }}
              >
                <FaDollarSign style={{ fontSize: "14px" }} />
              </div>
            </div>
            <TuitionSessionChart />
          </div>
        </div>
        <div className="sam-aside overflow">
          {overallAnalysis.map((obj, index) => (
            <div className="aside-card-container">
              <div className={`term-card-box second-card`}>
                <div className="inside-card">
                  <div className={`d-card-icon`}>
                    <FaDollarSign style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <h3>₦{formatAmount(obj.receivedFees)}</h3>
                    <p>{obj.name} Received Fees</p>
                  </div>
                </div>
              </div>
              <div className={`term-card-box third-card`}>
                <div className="inside-card">
                  <div className={`d-card-icon-dark`}>
                    <FaDollarSign style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <h3>₦{formatAmount(obj.expectedFees ?? 0)}</h3>
                    <p>{obj.name} Expected Fees</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolAccountManager;
