import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

export default function PrivateRouteWithRole({ children, rolesPermitidos }) {
    const { auth } = useContext(AuthContext);
    const rolUsuario = auth?.role || localStorage.getItem('role'); // Obtiene el rol del contexto o del localStorage

    // Si el usuario no tiene un rol válido, redirigir a login
    if (!rolUsuario) {
        return <Navigate to="/login" replace />;
    }

    // Si el rol del usuario no está en la lista de roles permitidos, redirigir
    if (!rolesPermitidos.includes(rolUsuario)) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario tiene permisos, renderiza la ruta protegida
    return children;
}
