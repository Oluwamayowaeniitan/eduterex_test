import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "../utils/tokenHelper";
import {
  getSchoolData,
  setSchoolData,
  removeSchoolData,
} from "../utils/schoolHelper";

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [schoolState, setSchoolState] = useState({
    classes: [],
    schoolStaffList: [],
    schoolSession: [],
    schoolStudents: [],
    subject: [],
    schoolResult: [],
    schoolTuition: [],
    sessionAccount: [],
    subscriptions: [],
  });

  useEffect(() => {
    const token = getToken();
    const schoolData = getSchoolData();
    if (token && schoolData) {
      setSchoolState({
        ...schoolState,
        ...schoolData,
      });
    }
    console.log(schoolData);
  }, []);

  const setSchoolDatas = (schoolDatas) => {
    console.log("new daf", schoolDatas);
    setSchoolState({
      ...schoolState,
      ...schoolDatas,
    });
    setSchoolData(schoolDatas);
  };

  return (
    <SchoolContext.Provider value={{ schoolState, setSchoolDatas }}>
      {children}
    </SchoolContext.Provider>
  );
};

// Custom hook for easier use
export const useSchool = () => useContext(SchoolContext);
