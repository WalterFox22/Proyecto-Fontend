import Logo from '../assets/LogoEMAUS.jpg';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from '../componets/Loading/Loading';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth,loading, setLoading } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });


  const [showPassword, setShowPassword] = useState(false);  // Estado para mostrar/ocultar la contraseña

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
      const url = `${import.meta.env.VITE_URL_BACKEND}/login`;
      const respuesta = await axios.post(url, form);
      localStorage.setItem('token', respuesta.data.token)
      setAuth(respuesta.data.administrador);
      toast.success(respuesta?.data?.msg);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {
        loading ? (
          <Loading/>
        ):(

        
      <div id="login-body">
        <div id="login-glass-container">
          <div id="login-box">
            <h2 id="login-title">LOGIN</h2>
            <form id="login-form" onSubmit={handleSubmit}>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Correo"
              />
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}  // Alternar entre texto y password
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Contraseña"
                  style={{
                    paddingRight: '35px',  // Espacio para el ícono
                    width: '100%',         // Asegura que el campo tenga el tamaño completo
                  }}
                />
                {/* Ícono de ojo */}
                <span
                  onClick={() => setShowPassword(!showPassword)}  // Alternar visibilidad
                  style={{
                    position: 'absolute',
                    right: '10px',      // Alinea el ícono a la derecha
                    top: '62%',
                    transform: 'translateY(-50%)',  // Centra el ícono verticalmente
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: 'white',     // Color blanco para el ícono
                  }}
                >
                  {showPassword ? <FaEye />: <FaEyeSlash />  }  {/* Alterna entre los íconos */}
                </span>
              </div>
               
              <div id="login-options">
                <Link to="/recuperacion/contrasenia" id="login-forgot-password">
                  Olvidaste tu contraseña?
                </Link>
              </div>
              
              <button id="login-button" className="btn btn-success">
                Ingresar
              </button>
              <br />
              {/** 
              <p id="login-register-text">¿No tienes una cuenta?</p>
              <Link to="/registro/representantes" id="login-register-link">
                Registrate
              </Link>
                */}
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Login;