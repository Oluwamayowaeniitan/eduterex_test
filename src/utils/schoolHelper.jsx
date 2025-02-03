export const getSchoolData = () => {
  const storedSchoolData = localStorage.getItem("schoolData");
  return JSON.parse(storedSchoolData) || null;
};

export const setSchoolData = (user) => {
  localStorage.setItem("schoolData", JSON.stringify(user));
};

export const removeSchoolData = () => {
  localStorage.removeItem("schoolData");
};
