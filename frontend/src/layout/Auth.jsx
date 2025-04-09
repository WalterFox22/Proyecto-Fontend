import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthProvider';
import Loading from '../componets/Loading/Loading';

const Auth = () => {
  const { auth, loading } = useContext(AuthContext);
  const autenticado = localStorage.getItem('token');
  const userRole = auth?.rol;

  useEffect(() => {
    // Si el usuario no está autenticado, limpiar la última URL visitada
    if (!autenticado) {
      localStorage.removeItem("lastVisitedPath");
    }
  }, [autenticado]);


  if (loading) {
    return <Loading />;
  }

  //Autentifica el rol si es el correcto para redireccionar al dashboard correspondiente
  // Redireccion al ultimo URL que estuvo tras dar F5
  if (autenticado && userRole) {
    const lastVisitedPath = localStorage.getItem("lastVisitedPath");
  
    if (userRole === "admin") {
      return <Navigate to={lastVisitedPath || "/dashboard"} />;
    } else if (userRole === "conductor") {
      return <Navigate to={lastVisitedPath || "/dashboardConductor"} />;
    } else {
      // Si el rol no es válido, redirigir al login o mostrar un mensaje de error
      console.error("Rol no válido:", userRole);
      return <Navigate to="/login" />;
    }
  }

 

  return (
    <main className="flex justify-center content-center w-full h-screen">
      <Outlet />
    </main>
  );
};

export default Auth;