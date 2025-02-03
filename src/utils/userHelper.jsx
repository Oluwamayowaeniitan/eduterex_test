export const getUser = () => {
  const storeduser = localStorage.getItem("user");
  return JSON.parse(storeduser) || null;
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  // Logic to remove token from localStorage or cookies
  localStorage.removeItem("user");
};
