import { apiHelper } from "../utils/apiHelper";

export const fetchSchoolConfig = async () => {
  const response = await apiHelper.get("school-config/");
  return response.data;
};

export const createSession = async (body) => {
  try {
    const response = await apiHelper.post("academic-session/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while creating the term.";
  }
};

export const promoteStudents = async (body) => {
  try {
    const response = await apiHelper.post("student-promotion/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while creating the term.";
  }
};

export const createTerm = async (body) => {
  try {
    const response = await apiHelper.post("academic-term/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while creating the session.";
  }
};

export const registerStaff = async (body) => {
  try {
    const response = await apiHelper.post("staff-controller/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while registering staffs.";
  }
};

export const updateStaff = async (body, id) => {
  try {
    const response = await apiHelper.put(`staff-controller/${id}/`, body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while updating staff.";
  }
};

export const registerStudent = async (body) => {
  try {
    const response = await apiHelper.post("register-student/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while registering students.";
  }
};

export const markAttendance = async (body) => {
  try {
    const response = await apiHelper.post("attendance/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while submitting attendance.";
  }
};

export const submitResult = async (body) => {
  try {
    const response = await apiHelper.post("result/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while submitting result.";
  }
};

export const addTuitionFee = async (body) => {
  try {
    const response = await apiHelper.post("tuition-fee-payment/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while submitting result.";
  }
};

export const activateSession = async (body) => {
  try {
    const response = await apiHelper.post("activate-session/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while submitting result.";
  }
};

export const approveResult = async (body) => {
  try {
    const response = await apiHelper.post("approve-result/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while approving result.";
  }
};

export const updatedBill = async (body) => {
  try {
    const response = await apiHelper.post("update-bills/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while updating bill.";
  }
};

export const settingsHandler = async (body) => {
  try {
    const response = await apiHelper.post("settings-handler/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while updating bill.";
  }
};

export const updateStaffData = async (body) => {
  try {
    const response = await apiHelper.post("update-profile/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while updating profile.";
  }
};

export const updatePassword = async (body) => {
  try {
    const response = await apiHelper.post("update-password/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while updating profile.";
  }
};

export const verifyPayments = async (body) => {
  try {
    const response = await apiHelper.post("verify-payment/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while verifying payment.";
  }
};
