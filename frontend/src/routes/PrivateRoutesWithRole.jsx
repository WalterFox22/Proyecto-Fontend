import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const PrivateRouteWithRole = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const userRole = auth?.rol || auth.roles || auth.role;

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(userRole) ? children : <Navigate to="/login" />;
};

export default PrivateRouteWithRole;