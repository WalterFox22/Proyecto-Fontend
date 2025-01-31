import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  // Verificar si el token ha expirado
  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificamos el JWT
    const currentTime = Date.now() / 1000; // Hora actual en segundos
    return decoded.exp < currentTime; // Si el tiempo de expiración es menor al actual
  };


  const perfil = async (token) => {
    try {
      const url = `${import.meta.env.VITE_URL_BACKEND}/visualizar/perfil/admin`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);
      setAuth(respuesta.data.administrador);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token'); // Limpiamos el token si está expirado
        setLoading(false); // Dejamos de mostrar la pantalla de carga
      } else {
        perfil(token); // Si el token es válido, obtenemos los datos del perfil
      }
    } else {
      setLoading(false); // Si no hay token, dejamos de mostrar la carga
    }

  }, []);

  








  return (
    <AuthContext.Provider value={
      { auth, 
        setAuth, 
        loading, 
        setLoading

      }
      }>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;