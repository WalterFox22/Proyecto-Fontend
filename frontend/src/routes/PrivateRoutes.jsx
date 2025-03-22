// Permite que si el token es correcto permita ingresar a las rutas privadas, de lo contrario redirige a la pagina de login
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const autenticado = localStorage.getItem("token");
  return autenticado ? children : <Navigate to="/login" />;
};
