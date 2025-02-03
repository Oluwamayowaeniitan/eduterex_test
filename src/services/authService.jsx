import { apiHelper } from "../utils/apiHelper";

export const loginUser = async (body) => {
  try {
    const response = await apiHelper.post("login/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while signing in.";
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiHelper.post("logout/");
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while login out.";
  }
};
