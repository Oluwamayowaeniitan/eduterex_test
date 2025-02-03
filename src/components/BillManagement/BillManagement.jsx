import React, { useState } from "react";
import "./BillManagement.css";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { RiBillFill } from "react-icons/ri";
import { BsCash } from "react-icons/bs";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiMinusCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { formatAmount } from "../FormatAmount";
import Loading from "../../utils/Loader";

const BillManagement = ({ formData, setFormData }) => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({ billName: "", billAmount: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  const handleAddBill = () => {
    if (newBill.billName && newBill.billAmount) {
      if (editingIndex !== null) {
        const updatedBills = [...bills];
        updatedBills[editingIndex] = newBill;
        setBills(updatedBills);
        setEditingIndex(null);
        setFormData({
          ...formData,
          extra_bills: updatedBills,
        });
      } else {
        setBills([...bills, newBill]);
        setFormData({
          ...formData,
          extra_bills: [...bills, newBill],
        });
      }
      setNewBill({ billName: "", billAmount: "" });
    } else {
      alert("Please fill in both the bill name and class.");
    }
  };

  const handleEditBill = (index) => {
    setNewBill(bills[index]);
    setEditingIndex(index);
  };

  const handleDeleteBill = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    setBills(updatedBills);
  };

  return (
    <div className="bill-management-container">
      <div className="card">
        <h3>Additional Bills</h3>
        <p>
          These are optional fees for services like hostel or school bus,
          specific to individual students. These info cannot be editted after
          submission.
        </p>
        <div className="form">
          <CustomTextInput
            name={"billName"}
            placeholder={"Bill Name"}
            handleChange={handleInputChange}
            value={newBill.billName}
            icon={<RiBillFill className="icons" />}
          />
          <CustomTextInput
            name={"BillAmount"}
            placeholder={"Bill Amount"}
            handleChange={handleInputChange}
            value={newBill.billAmount}
            icon={<BsCash className="icons" />}
          />
          <CgAdd
            className="action-icon"
            style={{ fontSize: "60px", width: "60px", height: "60px" }}
            onClick={handleAddBill}
          />
        </div>

        <div className="bill-list">
          <h4>Current Bills</h4>
          {bills.length === 0 ? (
            <p>No bills added yet.</p>
          ) : (
            <div>
              <ul>
                {bills.map((bill, index) => (
                  <li key={index} className="bill-item">
                    <span>
                      <strong>Name:</strong> {bill.billName} |{" "}
                      <strong>Amount:</strong> ₦{formatAmount(bill.billAmount)}
                    </span>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <BiEdit
                        className="action-icon"
                        style={{
                          fontSize: "25px",
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => {
                          handleEditBill(index);
                        }}
                      />
                      <PiMinusCircleBold
                        className="action-icon"
                        style={{
                          fontSize: "25px",
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => handleDeleteBill(index)}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillManagement;
