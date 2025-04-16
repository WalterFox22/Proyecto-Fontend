import { createContext, useState } from "react";
import axios from "axios";

// Creacion del grupo de whats ->
const EstudientesContext = createContext();

// Creacion del mensaje Authprovider  -> los integrantes que van a recivir ese mensaje
const EstudientesProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  // varible con useState
  const [modal, setModal] = useState(false);
  // para cambiar entre false y true
  const handleModal = () => {
    setModal(!modal);
  };

  //aasas

  const RegistrarEstudiantes = async (datos) => {
    const token = localStorage.getItem("token");
    const SelecctRol = localStorage.getItem("rol");
    let urlBase = "";
    try {
      if (SelecctRol === "conductor") {
        urlBase = `${import.meta.env.VITE_URL_BACKEND}/registro/estudiantes`;
      }
      if (urlBase) {
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const respuesta = await axios.post(urlBase, datos, options);
        setEstudiantes([respuesta.data, ...estudiantes]);
        return respuesta.data;
      }
    } catch (error) {
      console.log(error);
      return { error: error.response?.data || "Error desconocido" }; // Devuelve el error
    }
  };

  const UpdateEstudiantes = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/actualizar/estudiante/${id}`;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <EstudientesContext.Provider
      value={{
        // Contenido del Mensaje
        modal,
        setModal,
        handleModal,
        estudiantes,
        setEstudiantes,
        RegistrarEstudiantes,
        UpdateEstudiantes,
      }}
    >
      {children}
    </EstudientesContext.Provider>
  );
};
export { EstudientesProvider };
export default EstudientesContext;
