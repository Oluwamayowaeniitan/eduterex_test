import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import Registration from "./pages/Registration/Registration";
import StaffManager from "./pages/StaffManager/StaffManager";
import AcademicSession from "./pages/AcademicSession/AcademicSession";
import { AuthProvider } from "./context/AuthContext";
import StudentManager from "./pages/StudentManager/StudentManager";
import Attendance from "./pages/Attendance/Attendance";
import { SchoolProvider } from "./context/SchoolContext";
import ResultManager from "./pages/ResultManager/ResultManager";
import TuitionFeeManager from "./pages/TuitionFeeManager/TuitionFeeManager";
import SchoolAccountManager from "./pages/SchoolAccountManager/SchoolAccountManager";
import ViewResult from "./pages/ResultManager/ViewResult";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Subscription from "./pages/Subscription/Subscription";
import { useAuth } from "./context/AuthContext";
import NotAuthorized from "./pages/NotAuthorized/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { authState } = useAuth();
  const { user, loading } = authState;

  const routes = [
    {
      path: "/",
      element: <AdminDashboard />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/academic-session",
      element: <AcademicSession />,
      roles: ["Admin", "Principal"],
    },
    {
      path: "/registration",
      element: <Registration />,
      roles: ["Admin", "Principal"],
    },
    {
      path: "/staff-manager",
      element: <StaffManager />,
      roles: ["Admin", "Principal"],
    },
    {
      path: "/student-manager",
      element: <StudentManager />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/attendance-manager",
      element: <Attendance />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/result-manager",
      element: <ResultManager />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/view-result",
      element: <ViewResult />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/tuition-fee-manager",
      element: <TuitionFeeManager />,
      roles: ["Admin", "Principal"],
    },
    {
      path: "/account-manager",
      element: <SchoolAccountManager />,
      roles: ["Admin", "Principal"],
    },
    {
      path: "/settings",
      element: <Settings />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/profile",
      element: <Profile />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/dashboard",
      element: <AdminDashboard />,
      roles: ["Admin", "Principal", "Teacher"],
    },
    {
      path: "/subscription",
      element: <Subscription />,
      roles: ["Admin", "Principal", "Teacher"],
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="big-loader"></div>
      </div>
    );
  }

  return (
    <SchoolProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*">
            <Route path="signin" element={<Signin />} />
          </Route>
          {routes.map(({ path, element, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={roles} userRole={user?.role}>
                  <Home children={element} />
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="/not-authorized"
            element={<Home children={<NotAuthorized />} />}
          />
        </Routes>
      </BrowserRouter>
    </SchoolProvider>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
