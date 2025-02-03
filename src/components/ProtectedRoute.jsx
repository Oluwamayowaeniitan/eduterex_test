import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles, userRole }) => {
  console.log("This is the roleos", userRole);
  if (!roles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
