import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import Loading from "../componets/Loading/Loading";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth, loading, setLoading } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "", // Agregado para manejar el rol seleccionado
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role, email, password } = form;
      
      // Verificar que se haya seleccionado un rol
      if (role !== "admin" && role !== "conductor") {
        toast.error("Por favor, selecciona un rol antes de iniciar sesión.");
        return;
      }

      const url = `${import.meta.env.VITE_URL_BACKEND}/login`;
      const respuesta = await axios.post(url, {
        email,
        password,
        role: role, // Enviar el rol seleccionado
      });
      console.log(respuesta)
      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('role', role); // Guardar el rol en localStorage

      setAuth(respuesta.data);
      toast.success(respuesta?.data?.data?.msg);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : (
        <div id="login-body">
          {/* Icono para volver atrás */}
          <BsArrowLeftSquareFill
            className="back-icon"
            onClick={() => navigate("/categoria")}
          />
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

                <div id="login-options">
                  <Link
                    to="/recuperacion/contrasenia"
                    id="login-forgot-password"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>

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
