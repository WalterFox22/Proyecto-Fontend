import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Auth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para la autenticación
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-token`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setIsAuthenticated(true); // Token válido
                    }
                } catch (error) {
                    // Si el token no es válido o ha expirado
                    localStorage.removeItem('token'); // Eliminar token inválido
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false); // Si no hay token, no está autenticado
            }
        };

        verifyToken(); // Verificar token al cargar el componente
    }, [token]);

    if (isAuthenticated === null) {
        // Mientras se verifica el token, no hacer nada o mostrar un loading
        return <div>Loading...</div>;
    }

    return (
        <main className="flex justify-center content-center w-full h-screen ">
            {isAuthenticated ? (
                <Navigate to="/dashboard" /> // Si el token es válido, redirigir a /dashboard
            ) : (
                <Outlet /> // Si no está autenticado, mostrar las rutas públicas (login, etc.)
            )}
        </main>
    );
};

export default Auth;
