import React, { useState } from "react";
import "../StudentBill/StudentBill.css";
import { formatAmount } from "../FormatAmount";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { formatDate, generatePDF, toTitleCase } from "../../utils/Utils";
import { toWords } from "number-to-words";

const Receipt = ({
  school,
  student,
  tuition,
  session,
  term,
  studentClass,
  id,
}) => {
  const [loading, setLoading] = useState(false);

  const totalBillAmount = tuition?.bills.reduce((total, obj) => {
    return total + (parseFloat(obj?.billAmount) || 0); // Ensure billAmount is a number
  }, 0);

  return (
    <div className="sb-bill-container">
      <div id={`schoolreceipt$${id}`}>
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
            <p>Payment Receipt</p>
          </div>
        </div>
        <div className="sb-bill-content">
          <div className="sb-student-profile">
            <h4>Name:</h4>
            <p>
              {student?.last_name} {student?.first_name}
            </p>
          </div>
          <div className="sb-student-profile">
            <h4>Student ID:</h4>
            <p>{student?.student_id}</p>
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
                  <th>Daid Paid</th>
                  <th>Amount</th>
                  <th>Amount in words</th>
                </tr>
              </thead>
              <tbody>
                {tuition?.payments
                  ?.filter((_, index) => index <= id)
                  .map((obj, index) => (
                    <tr className="content-style">
                      <td style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                        {index + 1}.{" "}
                      </td>
                      <td>{formatDate(obj?.payment_date)}</td>
                      <td>₦{formatAmount(obj?.amount)}</td>
                      <td>{toTitleCase(toWords(obj?.amount))} Naira Only</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>Total Bill</th>
                  <th>Total Amount Paid</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="content-style">
                  <td className="bold-text">
                    ₦{formatAmount(tuition?.total_fee)}
                  </td>
                  <td className="bold-text">
                    ₦
                    {formatAmount(
                      tuition?.total_fee - tuition?.payments[id]?.balance,
                    )}
                  </td>
                  <td className="bold-text">
                    ₦{formatAmount(tuition?.payments[id]?.balance)}
                  </td>
                </tr>
              </tbody>
            </table>
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
            <p>
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
        }}
      >
        <CustomSmallButton
          text={loading ? <Loading /> : "Download"}
          icon={<PiArrowCircleDownBold />}
          runFunction={() =>
            generatePDF(
              `schoolreceipt$${id}`,
              `${student?.last_name}-${student?.first_name}-receipt-${tuition?.payments[id].ref_number}.pdf`,
            )
          }
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Receipt;
