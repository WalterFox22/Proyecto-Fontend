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
  const { setAuth } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "", // Agregado para manejar el rol seleccionado
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
      const url = `${import.meta.env.VITE_URL_BACKEND}/login`;
      const respuesta = await axios.post(url, form);
      console.log(respuesta);
      const { token, rol } = respuesta.data;
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol); // Guardar el rol en localStorage

      setAuth(respuesta.data);

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
                    type={showPassword ? "text" : "password"} // Alternar entre texto y password
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Contraseña"
                    style={{
                      paddingRight: "35px", // Espacio para el ícono
                      width: "100%", // Asegura que el campo tenga el tamaño completo
                    }}
                  />
                  {/* Ícono de ojo */}
                  <span
                    onClick={() => setShowPassword(!showPassword)} // Alternar visibilidad
                    style={{
                      position: "absolute",
                      right: "10px", // Alinea el ícono a la derecha
                      top: "62%",
                      transform: "translateY(-50%)", // Centra el ícono verticalmente
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "white", // Color blanco para el ícono
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                    {/* Alterna entre los íconos */}
                  </span>
                </div>

                {/* Mostrar el link solo si el rol es "conductor" */}
                {form.role === "conductor" && (
                  <div id="login-options">
                    <Link
                      to="/recuperacion/contrasenia"
                      id="login-forgot-password"
                    >
                      Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}
                <button id="login-button" className="btn btn-success">
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
