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
        if (respuesta.data) {
          if (respuesta.data.administrador) {
            setAuth({
              ...respuesta.data.administrador,
              rol: SelecctRol,
              esConductor: respuesta.data.esConductor,
            });
          } else if (respuesta.data.conductor) {
            setAuth({ ...respuesta.data.conductor, rol: SelecctRol });
          }
        } else {
          console.error("La respuesta no contiene datos válidos:", respuesta);
          throw new Error("Datos del perfil no encontrados");
        }
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
        cargarPerfil(token);
      }
    } else {
      console.warn("No hay token. Redirigiendo a login...");
      setLoading(false);
      //navigate("/login", { replace: true });
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
        return respuesta.data;
      }
    } catch (error) {
      console.log(error);
      // Retorna el error tal como lo envía el backend
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { msg_actualizacion_contrasenia: "Ocurrió un error inesperado" };
    }
  };

  // Registrar nuevo administardor

  const NewAdmin = async (dato) => {
    const token = localStorage.getItem("token");
    const Rolpermitido = localStorage.getItem("rol");
    try {
      if (Rolpermitido === "admin") {
        const url = `${import.meta.env.VITE_URL_BACKEND}/registro/nuevo/admin`;
        const options = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        const respuesta = await axios.post(url, dato, options);
        setAuth([respuesta.data.administrador]);
        return respuesta.data.administrador;
      }
    } catch (error) {}
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
        NewAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
