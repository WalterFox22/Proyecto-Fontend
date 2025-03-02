import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si el token ha expirado
  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificamos el JWT
    const currentTime = Date.now() / 1000; // Hora actual en segundos
    return decoded.exp < currentTime; // Si el tiempo de expiración es menor al actual
  };

  const perfil = async (token) => {
    console.log(localStorage.getItem("role"));
    const SelecctRol = localStorage.getItem("role");
    if ("admin" === SelecctRol) {
      try {
        const urlA = `${import.meta.env.VITE_URL_BACKEND}/visualizar/perfil/admin`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.get(urlA, options);
        console.warn(respuesta);
        setAuth(respuesta.data); // Guardamos toda la información del usuario
        // Verificamos los roles del usuario
        const rolesUsuario = respuesta.data.roles || [];
        if (rolesUsuario.includes("admin")) {
          navigate("/dashboard"); // Redirigimos al dashboard del admin
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else if ("conductor" === SelecctRol) {
      try {
        const urlC = `${import.meta.env.VITE_URL_BACKEND}/perfil/conductor`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.get(urlC, options);
        console.warn(respuesta);

        setAuth(respuesta.data); // Guardamos toda la información del usuario
        // Verificamos los roles del usuario
        const rolesUsuario = respuesta.data.roles || [];
        if (rolesUsuario.includes("conductor")) {
          navigate("/dashboardConductor"); // Redirigimos al dashboard del conductor
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token"); // Limpiamos el token si está expirado
        setLoading(false); // Dejamos de mostrar la pantalla de carga
      } else {
        perfil(token); // Si el token es válido, obtenemos los datos del perfil
      }
    } else {
      setLoading(false); // Si no hay token, dejamos de mostrar la carga
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
