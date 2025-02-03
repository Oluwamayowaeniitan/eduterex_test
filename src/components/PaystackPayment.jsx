import React, { useEffect } from "react";
import { PaystackButton } from "react-paystack";

const PaystackPayment = ({
  amount,
  email,
  onSuccess,
  setPlan,
  selectedPlan,
  onClose,
  paystackClassName,
}) => {
  useEffect(() => {
    setPlan(selectedPlan);
  }, [selectedPlan]);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey: "pk_test_80be5fa45cd9c618ea398bd079f47b5f974d938c",
  };

  const handleSuccess = (reference) => {
    onSuccess(reference);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <PaystackButton
      {...config}
      text="Pay Now"
      className={paystackClassName}
      onSuccess={handleSuccess}
      onClose={handleClose}
    />
  );
};

export default PaystackPayment;
