import Logo from '../assets/LogoEMAUS.jpg';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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
      console.log(respuesta)
      setAuth(respuesta.data.administrador);
      toast.success(respuesta?.data?.msg);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div id="login-body">
        <div id="login-glass-container">
          <div id="login-box">
            <h2 id="login-title">Login</h2>
            <form id="login-form" onSubmit={handleSubmit}>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
              <div id="login-options">
                <Link to="/recuperacion/contrasenia" id="login-forgot-password">
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <button id="login-button" className="btn btn-success">
                Ingresar
              </button>
              <br />
              <p id="login-register-text">¿No tienes una cuenta?</p>
              <Link to="/registro/representantes" id="login-register-link">
                Registrate
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;