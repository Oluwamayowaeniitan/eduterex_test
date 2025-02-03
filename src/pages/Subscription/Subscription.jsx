import React, { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import "./Subscription.css";
import { useSchool } from "../../context/SchoolContext";
import { useAuth } from "../../context/AuthContext";
import { formatAmount } from "../../components/FormatAmount";
import { toTitleCase } from "../../utils/Utils";
import PaystackPayment from "../../components/PaystackPayment";
import { verifyPayments } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";

const Subscription = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { authState, updateUser } = useAuth();
  const { user } = authState;

  const { subscriptions } = schoolState;

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [plan, setPlan] = useState("");

  // Extract only the extra fields (excluding id, name, and amount)
  const processSubscriptions = () => {
    return subscriptions.map(({ id, name, amount, ...rest }) => rest);
  };

  const newSubscription = processSubscriptions();

  const UseIcon = ({ obj }) => {
    if (obj) {
      return (
        <div className="circle-check" style={{ background: "#925fe2" }}>
          <FiCheck className="checkmark" style={{ color: "#fff" }} />
        </div>
      );
    } else {
      return (
        <div className="circle-check" style={{ background: "#f3e8ff" }}>
          <FiX className="checkmark" style={{ color: "#925fe2" }} />
        </div>
      );
    }
  };

  const handleSuccess = async (reference) => {
    const response = await verifyPayments(
      JSON.stringify({ reference, plan: plan }),
    );
    if (response.status === "success") {
      console.log("The new response", response);
      setSchoolDatas(response.schoolData);
      updateUser(response.user);
      setMessage("Payment successful!");
      setSuccessStatus(true);
    } else {
      setMessage("Payment verification failed!");
      setSuccessStatus(false);
    }
  };

  return (
    <div className="plan-container">
      <div className="onboarding-title">
        <h4>
          Your current plan: {user?.school?.subscription_plan?.name || "N/A"} |
          Expires on: {user?.school?.subscription_end_date || "N/A"}
        </h4>
        <br />
        <h3>Upgrade your plan</h3>
        <p>Select a plan that works best for your school’s needs</p>
      </div>
      <div className="plan-subcontainer">
        {subscriptions.map((subscription, index) => (
          <div
            className="plan-card"
            style={{
              backgroundColor:
                index === 0 ? "#fff" : index === 1 ? "#ffadbc" : "#711a75",
              color: index === 2 ? "#fff" : "#000",
            }}
            key={index}
          >
            <h3>{subscription?.name || "Null"}</h3>
            <div className="amount-flex">
              <h1>₦{formatAmount(subscription?.amount)} </h1>
              <p> / 3-months</p>
            </div>

            <div
              className={`btn-container ${index === 2 && "paystack-white-btn"}`}
            >
              {index === 0 ? (
                <button className="btn">Free</button>
              ) : user?.school?.subscription_plan?.id === subscription?.id ? (
                <button className="btn">Current Plan</button>
              ) : (
                <PaystackPayment
                  paystackClassName="btn"
                  amount={subscription?.amount}
                  email={user?.email_address}
                  setPlan={setPlan}
                  selectedPlan={subscription?.id}
                  onSuccess={handleSuccess}
                  onClose={() => {
                    setMessage("Payment closed");
                    setSuccessStatus(false);
                  }}
                />
              )}
            </div>
            <div className="plan-item-container">
              {Object.entries(newSubscription[index]).map(([key, value], i) => (
                <div className="plan-item" key={i}>
                  <UseIcon obj={value} />
                  <p>
                    {key.includes("member")
                      ? `${value} members`
                      : toTitleCase(key.replaceAll("_", " "))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
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

export default Subscription;
