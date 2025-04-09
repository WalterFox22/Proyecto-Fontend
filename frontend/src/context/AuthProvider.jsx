import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar si el token ha expirado
  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificamos el JWT
    const currentTime = Date.now() / 1000; // Hora actual en segundos
    return decoded.exp < currentTime; // Si el tiempo de expiración es menor al actual
  };

  // Apartado de actualizar perfil
  const cargarPerfil = async (token) => {
    console.warn("Rol seleccionado:", localStorage.getItem("rol"));
    const SelecctRol = localStorage.getItem("rol");
    try {
      let url = "";
      if (SelecctRol === "admin") {
        url = `${import.meta.env.VITE_URL_BACKEND}/visualizar/perfil/admin`;
      } else if (SelecctRol === "conductor") {
        url = `${import.meta.env.VITE_URL_BACKEND}/perfil/conductor`;
      }

      if (url) {
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.get(url, options);
        //setAuth({ ...respuesta.data.conductor }); // Actualiza el estado auth con el rol
        //setAuth({ ...respuesta.data, role: SelecctRol }); // Actualiza el estado auth con el rol
        // Verifica si la respuesta contiene los datos esperados
        if (respuesta.data) {
          // Actualiza el estado `auth` con los datos del perfil
          setAuth({ ...respuesta.data, rol: SelecctRol } || {...respuesta.data.conductor, rol: SelecctRol}); // Incluye el rol en el estado
          console.warn("Perfil cargado correctamente:", respuesta.data);
        } else {
          console.error("La respuesta no contiene datos válidos:", respuesta);
          throw new Error("Datos del perfil no encontrados");
        }
        console.warn("Perfil cargado:", respuesta);
      } else {
        console.error("Rol no reconocido:", SelecctRol);
        throw new Error("Rol desconocido");
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      setError("Error al obtener el perfil. Por favor, intente nuevamente.");
      localStorage.removeItem("token");
      navigate("/login", { replace: true }); // Reemplaza para evitar bucles
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        setLoading(false);
        navigate("/login", { replace: true });
      } else {
        console.log("Token válido. Cargando perfil...");
        cargarPerfil(token);
      }
    } else {
      console.warn("No hay token. Redirigiendo a login...");
      setLoading(false);
      navigate("/login", { replace: true });
    }
  }, []);

  // Actualizar el password
  const UpdatePassword = async (datos) => {
    const token = localStorage.getItem("token");
    const SelecctRol = localStorage.getItem("rol");

    try {
      let url = "";
      if (SelecctRol === "admin") {
        url = `${
          import.meta.env.VITE_URL_BACKEND
        }/actualizar/contrasenia/admin`;
      } else if (SelecctRol === "conductor") {
        url = `${
          import.meta.env.VITE_URL_BACKEND
        }/actualizar/contrasenia/conductor`;
      }
      if (url) {
        const options = {
          headers: {
            method: "PATCH",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const respuesta = await axios.patch(url, datos, options);
        return { respuesta: respuesta.data.msg, tipo: true };
      }
    } catch (error) {
      console.log(error);
      return { respuesta: error.response.data.msg, tipo: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        UpdatePassword,
        cargarPerfil,
        loading,
        setLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;