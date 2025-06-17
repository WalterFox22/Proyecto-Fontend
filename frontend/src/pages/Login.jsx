import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../componets/Loading/Loading";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth, cargarPerfil } = useContext(AuthContext); // Importar cargarPerfil

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "", // Agregado para manejar el rol seleccionado
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado local para la pantalla de carga

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "password"
          ? value.trimStart() // Elimina espacios al inicio mientras escribe
          : value,
    }));
  };

  // Elimina espacios al inicio y final al enviar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanForm = {
        ...form,
        password: form.password.trim(), // Elimina espacios al inicio y final
      };
      const url = `${import.meta.env.VITE_URL_BACKEND}/login`;
      const respuesta = await axios.post(url, cleanForm);
      console.log(respuesta);
      const { token, rol, redirigir, msg } = respuesta.data;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol); // Guardar el rol en localStorage

      setAuth(respuesta.data);

      // Cargar el perfil inmediatamente después del inicio de sesión
      await cargarPerfil(token);

      toast.success(
        respuesta?.data?.msg_login_conductor ||
          respuesta?.data?.msg_login_representante
      );
      if (rol === "admin") {
        navigate("/dashboard");
      } else if (rol === "conductor") {
        navigate("/dashboardConductor");
      }
    } catch (error) {
      if (error.response) {
        // Si el backend devuelve un error, mostrar el mensaje correspondiente
        const errorMessage =
          error.response?.data?.msg ||
          error.response?.data?.msg_autenticacion ||
          "Error desconocido";

        // Validar si el mensaje es "Debe cambiar su contraseña antes de continuar."
        if (errorMessage === "Debe cambiar su contraseña antes de continuar.") {
          console.log("Redirigiendo a FirstPassword..."); // Confirmar que entra aquí
          toast.info(errorMessage, { position: "top-right", autoClose: 3000 });
          navigate("/cambiar/contraseña/firt"); // Redirige a FirstPassword
          return;
        }

        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } else {
        // Si el error es de conexión o no hay respuesta del backend
        toast.error("Error de conexión, por favor intenta de nuevo.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false); // Desactiva la pantalla de carga local
    }
  };

  // Validación para habilitar/deshabilitar el botón
  const isFormValid = form.role && form.email && form.password;

  return (
    <>
      <ToastContainer />
      {isSubmitting ? (
        <Loading />
      ) : (
        <div id="login-body">
          <div id="login-glass-container">
            <div id="login-box">
              <h2 id="login-title">LOGIN</h2>
              <form id="login-form" onSubmit={handleSubmit}>
                {/* Selector de rol con id único */}
                <select
                  id="login-role-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Admintrador</option>
                  <option value="conductor">Conductor</option>
                </select>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Correo"
                />
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Contraseña"
                    style={{
                      paddingRight: "35px",
                      width: "100%",
                    }}
                  />
                  {/* Ícono de ojo */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "62%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "white",
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                  </span>
                </div>

                <div id="login-options">
                  <Link
                    to="/recuperacion/contrasenia"
                    id="login-forgot-password"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  id="login-button"
                  className="btn btn-success"
                  type="submit"
                  disabled={!isFormValid}
                  style={{
                    opacity: isFormValid ? 1 : 0.6,
                    cursor: isFormValid ? "pointer" : "not-allowed",
                  }}
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
