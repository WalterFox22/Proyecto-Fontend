import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

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
      perfil(token);
    }
    
  }, [])

  const actualizarPerfil = async(datos) => {
    const token = localStorage.getItem('token')
    try {
        const url = `${import.meta.env.VITE_URL_BACKEND}/actualizar/conductor/${datos.id}`
        const options = {
            headers: {
                method: 'PATCH',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        const respuesta = await axios.patch(url, datos, options)
        perfil(token)
        return {respuesta:respuesta.data.msg,tipo:true}
    } catch (error) {
        return {respuesta:error.response.data.msg,tipo:false}
    }
}

const actualizarPassword = async (datos) => {
    const token = localStorage.getItem('token')
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}`
        const options = {
            headers: {
                method: 'PUT',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        const respuesta = await axios.put(url, datos, options)
        return { respuesta: respuesta.data.msg, tipo: true }
    } catch (error) {
        return { respuesta: error.response.data.msg, tipo: false }
    }
}








  return (
    <AuthContext.Provider value={
      { auth, 
        setAuth, 
        loading, 
        setLoading,
        actualizarPerfil,
        actualizarPassword 

      }
      }>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;