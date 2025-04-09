import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const PrivateRouteWithRole = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const userRole = auth?.rol;

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(userRole) ? children : <Navigate to="/login" />;
};

export default PrivateRouteWithRole;