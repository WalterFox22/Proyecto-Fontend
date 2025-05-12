import "../Styles/styleStart.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../componets/Loading/Loading";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const FirstPassword = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    passwordActual: "",
    passwordActualConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado local para la pantalla de carga

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activa la pantalla de carga local
    try {
      const url = `${
        import.meta.env.VITE_URL_BACKEND
      }/cambiar/contrasenia/primer/inicio`;
      const respuesta = await axios.patch(url, {
        email: form.email,
        passwordActual: form.passwordActual,
        passwordActualConfirm: form.passwordActualConfirm,
      });

      setAuth(respuesta.data);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "La contraseña ha sido cambiada correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/login"); // Redirige al login después de aceptar
      });
    } catch (error) {
      if (error.response) {
        const errorMessage =
        error.response?.data?.error?.msg || // Mensaje de validación del backend
        error.response?.data?.msg_cambio_contrasenia || // Otros mensajes del backend
        "Error desconocido";  

        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } else {
        toast.error("Error de conexión, por favor intenta de nuevo.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false); // Desactiva la pantalla de carga local
    }
  };

  return (
    <>
      <ToastContainer />
      {isSubmitting ? (
        <Loading />
      ) : (
        <div id="first-password-body">
          <div id="first-password-glass-container">
            <div id="first-password-box">
              <h2 id="first-password-title">Cambiar la contraseña</h2>
              <form id="first-password-form" onSubmit={handleSubmit}>
                <input
                  id="first-password-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Correo"
                />
                <div className="input-container">
                  <input
                    id="first-password-password"
                    type={showPassword ? "text" : "password"}
                    name="passwordActual"
                    value={form.passwordActual}
                    onChange={handleChange}
                    required
                    placeholder="Contraseña"
                    className="input-with-icon"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-icon"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div className="input-container">
                  <input
                    id="first-password-passwordConfirmar"
                    type={showPassword ? "text" : "password"}
                    name="passwordActualConfirm"
                    value={form.passwordActualConfirm}
                    onChange={handleChange}
                    required
                    placeholder="Confirmación Contraseña"
                    className="input-with-icon"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-icon"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <button id="first-password-button" className="btn btn-success">
                  Cambiar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FirstPassword;
